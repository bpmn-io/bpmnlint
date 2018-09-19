const Linter = require('../linter');

const NodeResolver = require('../resolver/node-resolver');

/**
 * Compile the bpmnlint configuration to a JavaScript file that exports
 * a { config, resolver } bundle, resolving all enabled rules.
 *
 * @param  {Object} config the parsed bpmnlint configuration
 *
 * @return {Promise<String>} the configuration compiled to a JS file
 */
async function compileConfig(config) {

  const linter = new Linter({
    resolver: new NodeResolver()
  });

  const resolvedRules = await linter.resolveConfiguredRules(config);

  const serializedRules = JSON.stringify(resolvedRules, null, '  ');

  const preambleCode = `
var cache = {};

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 *
 * @param {Object} cache
 */
function Resolver() {}

Resolver.prototype.resolveRule = function(pkg, ruleName) {

  const rule = cache[pkg + '/' + ruleName];

  if (!rule) {
    throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>');
  }

  return rule;
};

Resolver.prototype.resolveConfig = function(pkg, configName) {
  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>'
  );
};

var resolver = new Resolver();

var rules = ${serializedRules};

var config = {
  rules: rules
};

var bundle = {
  resolver: resolver,
  config: config
};

export { resolver, config };

export default bundle;
`;

  const importCode = Object.entries(resolvedRules).filter(
    ([ key, value ]) => linter.parseRuleValue(value).ruleFlag !== 'off'
  ).map(([ key, value ], idx) => {

    const {
      pkg, ruleName
    } = linter.parseRuleName(key);

    return `
import rule_${idx} from '${pkg}/rules/${ruleName}';
cache['${pkg}/${ruleName}'] = rule_${idx};`;
  }).join('\n');

  return `${preambleCode}\n\n${importCode}`;
}

module.exports = compileConfig;