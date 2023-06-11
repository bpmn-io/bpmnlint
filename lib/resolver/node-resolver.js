const Module = require('module');
const path = require('path');

const { isString } = require('min-dash');

/**
 * A resolver that locates rules and configurations
 * using node module resolution.
 */
function NodeResolver(options) {
  this.require = options && options.require || createScopedRequire(process.cwd());

  this.requireLocal = options && options.requireLocal || require;

  try {
    this.pkg = this.require('./package.json').name;
  } catch (err) {
    this.pkg = '__unknown';
  }
}

module.exports = NodeResolver;


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

function createScopedRequire(cwd) {

  // shim createRequireFromPath for Node < 10.12
  // shim createRequireFromPath for Node < 12.2.0
  const createRequireFromPath = Module.createRequire || Module.createRequireFromPath || (filename => {
    const mod = new Module(filename, null);

    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename));
    mod._compile('module.exports = require;', filename);

    return mod.exports;
  });

  return createRequireFromPath(path.join(cwd, '__placeholder__.js'));
}