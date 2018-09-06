/**
 * A resolver that locates rules and configurations
 * using node module resolution.
 */
function NodeResolver(options) {
  this.require = options && options.require || require;
}

module.exports = NodeResolver;


NodeResolver.prototype.resolveRule = function(pkg, ruleName) {

  try {
    return this.require(`${pkg}/rules/${ruleName}`);
  } catch (err) {
    if (pkg === 'bpmnlint') {
      // attempt local require
      return this.require(`../../rules/${ruleName}`);
    }

    throw err;
  }
};

NodeResolver.prototype.resolveConfig = function(pkg, configName) {

  // resolve config via $PKG/config/$NAME`
  try {
    return this.require(`${pkg}/config/${configName}`);
  } catch (err) { /* ignore */ }

  // resolve built-in as local config via ../../config/$NAME`
  if (pkg === 'bpmnlint') {
    try {
      // attempt local require
      return this.require(`../../config/${configName}`);
    } catch (err) { /* ignore */ }
  }

  // resolve config via $PKG.configs[$NAME]
  const instance = this.require(pkg);

  if ('configs' in instance) {
    if (configName in instance.configs) {
      return instance.configs[configName];
    }
  }

  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>'
  );
};