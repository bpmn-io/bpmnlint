const Module = require('node:module');
const path = require('node:path');
const { cwd } = require('node:process');

const { isString } = require('min-dash');

/**
 * @typedef { import('../types.js').RuleFactory } RuleFactory
 * @typedef { import('../types.js').Config } Config
 */


/**
 * A resolver that locates rules and configurations
 * using node module resolution.
 *
 * @param { { require?: NodeRequire, requireLocal?: NodeRequire } } [options]
 */
function NodeResolver(options) {
  this.require = options && options.require || createScopedRequire(cwd());

  this.requireLocal = options && options.requireLocal || require;

  try {
    this.pkg = this.require('./package.json').name;
  } catch (err) {
    this.pkg = '__unknown';
  }
}

module.exports = NodeResolver;


/**
 * @param { string } pkg
 * @param { string } ruleName
 *
 * @return { RuleFactory }
 */
NodeResolver.prototype.resolveRule = function(pkg, ruleName) {

  const originalPkg = pkg;

  pkg = this.normalizePkg(pkg);

  let pkgInstance;

  // (1) try resolving rule via $PKG.rules[$NAME]
  try {
    pkgInstance = this.require(pkg);
  } catch (err) {

    /* ignore */
  }

  if (pkgInstance) {
    const rules = pkgInstance.rules || {};

    if (ruleName in rules) {
      const rule = rules[ruleName];

      if (!isString(rule)) {
        throw new Error('cannot resolve rule <' + ruleName + '> from <' + originalPkg + '>: illegal rule export (expected path reference)');
      }

      // local reference, resolved relative to pkg location
      if (rule.startsWith('.')) {
        const pkgDir = path.dirname(this.require.resolve(pkg));

        return this.require(path.posix.normalize(`${ pkgDir }/${ rule }`));
      }

      // absolute reference
      return this.require(rule);
    }
  }

  // (2) try resolving rule via $PKG/rules/$NAME
  try {
    if (pkg === 'bpmnlint') {
      return this.requireLocal(`../../rules/${ruleName}`);
    } else {
      return this.require(`${pkg}/rules/${ruleName}`);
    }
  } catch (err) { /* ignore */ }

  throw new Error('cannot resolve rule <' + ruleName + '> from <' + originalPkg + '>');
};

/**
 * @param { string } pkg
 * @param { string } configName
 *
 * @return { Config }
 */
NodeResolver.prototype.resolveConfig = function(pkg, configName) {

  const originalPkg = pkg;

  pkg = this.normalizePkg(pkg);

  // (1) try resolving config via $PKG.configs[$NAME]
  try {
    const instance = this.require(pkg);

    const configs = instance.configs || {};

    if (configName in configs) {
      return configs[configName];
    }
  } catch (err) {

    /* ignore */
  }

  // (2) try resolving config via $PKG/config/$NAME
  try {
    if (pkg === 'bpmnlint') {
      return this.requireLocal(`../../config/${configName}`);
    } else {
      return this.require(`${pkg}/config/${configName}`);
    }
  } catch (err) { /* ignore */ }

  throw new Error(
    'cannot resolve config <' + configName + '> from <' + originalPkg + '>'
  );
};

NodeResolver.prototype.normalizePkg = function(pkg) {
  if (pkg !== 'bpmnlint' && pkg === this.pkg) {
    pkg = '.';
  }

  return pkg;
};

// helpers ////////////////////

/**
 * @param {string} cwd
 */
function createScopedRequire(cwd) {
  return Module.createRequire(path.join(cwd, '__placeholder__.js'));
}