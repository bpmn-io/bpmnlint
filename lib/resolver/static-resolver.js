/**
 * @typedef { import('../types.js').RuleFactory } RuleFactory
 * @typedef { import('../types.js').Config } Config
 */


/**
 * A resolver that resolves rules and packages from a static cache.
 *
 * @param { any } cache
 */
function StaticResolver(cache) {
  this.cache = cache;
}

module.exports = StaticResolver;

/**
 * @param { string } pkg
 * @param { string } ruleName
 *
 * @return { RuleFactory }
 */
StaticResolver.prototype.resolveRule = function(pkg, ruleName) {
  return /** @type { RuleFactory } */ (this.resolve('rule', pkg, ruleName));
};

/**
 * @param { string } pkg
 * @param { string } configName
 *
 * @return { Config }
 */
StaticResolver.prototype.resolveConfig = function(pkg, configName) {
  return /** @type { Config } */ (this.resolve('config', pkg, configName));
};

StaticResolver.prototype.resolve = function(type, pkg, name) {
  const id = `${pkg}/${name}`;

  const resolved = this.cache[`${type}:${id}`];

  if (!resolved) {
    throw new Error(`unknown ${type} <${id}>`);
  }

  return resolved;
};