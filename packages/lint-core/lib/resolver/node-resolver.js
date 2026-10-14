const path = require('node:path');
const { cwd } = require('node:process');

const { isString } = require('min-dash');

/**
 * @typedef { import('../types.js').RuleFactory } RuleFactory
 * @typedef { import('../types.js').Config } Config
 * @typedef { import('../types.js').Product } Product
 */

const { normalizeProduct } = require('../product');

const { createScopedRequire } = require('./helper');

/**
 * Create a `NodeResolver` for the given product.
 *
 * Rules and configurations of the product itself are loaded
 * via <options.requireLocal>, which must be a `require` function that is
 * scoped to the `lib/resolver` directory of the product package.
 *
 * @param { Product } product
 * @param { { requireLocal: NodeRequire } } options
 */
function createNodeResolver(product, options) {

  const {
    name: productName
  } = normalizeProduct(product);

  const defaultRequireLocal = options && options.requireLocal;

  if (typeof defaultRequireLocal !== 'function') {
    throw new Error('must provide <options.requireLocal>');
  }

  /**
   * A resolver that locates rules and configurations
   * using node module resolution.
   *
   * @param { { require?: NodeRequire, requireLocal?: NodeRequire } } [options]
   */
  function NodeResolver(options) {
    this.require = options && options.require || createScopedRequire(cwd());

    this.requireLocal = options && options.requireLocal || defaultRequireLocal;

    try {
      this.pkg = this.require('./package.json').name;
    } catch (err) {
      this.pkg = '__unknown';
    }
  }


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
      if (pkg === productName) {
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
      if (pkg === productName) {
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
    if (pkg !== productName && pkg === this.pkg) {
      pkg = '.';
    }

    return pkg;
  };

  return NodeResolver;
}

module.exports = {
  createNodeResolver
};
