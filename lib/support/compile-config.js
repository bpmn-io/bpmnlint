const path = require('path');

const { isString } = require('min-dash');

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
    throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>: not bundled');
  }

  return rule;
};

Resolver.prototype.resolveConfig = function(pkg, configName) {
  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>: not bundled'
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

    return createImportStatement(pkg, ruleName, idx, resolver);
  }).filter(e => e).join('\n');

  return `${preambleCode}${importCode}`;
}

module.exports = compileConfig;

function requirePkg(resolver, pkg) {
  try {
    return resolver.require(pkg);
  } catch (err) {
    return null;
  }
}

function createImportStatement(pkg, ruleName, idx, resolver) {
  const originalPkg = pkg;

  pkg = resolver.normalizePkg(pkg);

  const pkgExport = requirePkg(resolver, pkg);

  // (1) try resolving rule via $PKG.rules[$NAME]
  if (pkgExport && pkgExport.rules) {
    const rules = pkgExport.rules;

    if (ruleName in rules) {
      const rule = rules[ruleName];

      if (!isString(rule)) {
        throw new Error(
          `failed to bundle rule <${ruleName}> from <${ pkg }>: illegal rule export (expected path reference)`
        );
      }

      const rulePath = computeRuleImport(resolver, pkg, originalPkg, rule);

      return `
import rule_${ idx } from '${rulePath}';

cache['${ originalPkg }/${ ruleName }'] = rule_${ idx };`;

    }
  }

  // (2) resolve rule via $PKG/rules/$NAME
  return `
import rule_${ idx } from '${ pkg }/rules/${ ruleName }';

cache['${ originalPkg }/${ ruleName }'] = rule_${ idx };`;
}

function computeRuleImport(resolver, pkg, originalPkg, rule) {

  // local reference, resolved relative to pkg location
  if (rule.startsWith('.')) {
    const pkgJsonPath = resolver.require.resolve(`${ pkg }/package.json`);

    const pkgMainPath = resolver.require.resolve(pkg);

    const relativePkgMainPath = path.relative(
      path.dirname(pkgJsonPath),
      path.dirname(pkgMainPath)
    );

    return path.posix.normalize(`${ originalPkg }/${ relativePkgMainPath }/${ rule }`);
  } else {

    // absolute reference
    return path.posix.normalize(rule);
  }
}