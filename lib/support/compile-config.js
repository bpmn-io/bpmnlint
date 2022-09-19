const Linter = require('../linter');

const NodeResolver = require('../resolver/node-resolver');

/**
 * Compile the bpmnlint configuration to a JavaScript file that exports
 * a { config, resolver } bundle, resolving all enabled rules.
 *
 * @param  {Object} config the parsed bpmnlint configuration
 * @param  {NodeResolver} [resolver]
 * @return {Promise<String>} the configuration compiled to a JS file
 */
async function compileConfig(config, resolver) {

  resolver = resolver || new NodeResolver();

  const linter = new Linter({
    resolver
  });

  const resolvedRules = await linter.resolveConfiguredRules(config);

  // only process and serialize enabled rules
  const rules = Object.keys(resolvedRules).reduce(function(rules, key) {
    const value = resolvedRules[key];

    const { category } = linter.parseRuleValue(value);

    if (category === 'off') {
      rules[key] = 0;
    } else {
      rules[key] = value;
    }

    return rules;
  }, {});

  const serializedRules = JSON.stringify(rules, null, '  ');

  const preambleCode = `
const cache = {};

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

const resolver = new Resolver();

const rules = ${serializedRules};

const config = {
  rules: rules
};

const bundle = {
  resolver: resolver,
  config: config
};

export { resolver, config };

export default bundle;
`;

  const importCode = Object.entries(rules).map(([ key, value ], idx) => {

    if (!value) {
      return null;
    }

    const {
      pkg, ruleName
    } = linter.parseRuleName(key);

    return `
import rule_${idx} from '${resolver.normalizePkg(pkg)}/rules/${ruleName}';
cache['${pkg}/${ruleName}'] = rule_${idx};`;
  }).filter(e => e).join('\n');

  return `${preambleCode}\n\n${importCode}`;
}

module.exports = compileConfig;