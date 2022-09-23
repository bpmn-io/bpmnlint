function NestedResolver(resolvers) {
  this.resolvers = resolvers.reverse();
}

module.exports = NestedResolver;


NestedResolver.prototype.resolveRule = function(pkg, ruleName) {
  for (const resolver of this.resolvers) {
    try {
      return resolver.resolveRule(pkg, ruleName);
    } catch (err) {

      // ignore
    }
  }

  throw new Error(`unknown rule <${pkg}/${ruleName}>`);
};

NestedResolver.prototype.resolveConfig = function(pkg, configName) {
  for (const resolver of this.resolvers) {
    try {
      return resolver.resolveConfig(pkg, configName);
    } catch (err) {

      // ignore
    }
  }

  throw new Error(`unknown config <${pkg}/${configName}>`);
};