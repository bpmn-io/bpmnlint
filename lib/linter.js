const testRule = require('./testRule');
const utils = require('./utils');

const flagsMap = {
  1: 'warnings',
  2: 'errors',
  warn: 'warnings',
  error: 'errors'
};


function Linter(options = {}) {

  const {
    resolver
  } = options;

  if (typeof resolver === 'undefined') {
    throw new Error('must provide <options.resolver>');
  }

  this.resolver = resolver;

  this.cachedRules = {};
}


module.exports = Linter;

/**
 * Applies a rule on the moddleRoot and adds reports to the finalReport
 *
 * @param {ModdleElement} options.moddleRoot
 * @param {String|Number} options.ruleFlag
 * @param {Rule} options.rule
 *
 * @return {Object} lint results, keyed by category name
 */
Linter.prototype.applyRule = function applyRule({ moddleRoot, ruleFlag, rule, ruleConfig }) {

  if (typeof ruleFlag === 'string') {
    ruleFlag = ruleFlag.toLowerCase();
  }

  const flagName = flagsMap[ruleFlag];

  if (!flagName) {
    return {};
  }

  const reports = testRule({ moddleRoot, rule, ruleConfig });

  return { [flagName]: reports };
};


Linter.prototype.resolveRule = function(name) {

  const rule = this.cachedRules[name];

  if (rule) {
    return Promise.resolve(rule);
  }

  return Promise.resolve(this.resolver.resolveRule(name)).then((ruleFactory) => {

    if (!ruleFactory) {
      throw new Error(`unknown rule <${name}>`);
    }

    const rule = this.cachedRules[name] = ruleFactory(utils);

    return rule;
  });
};

/**
 * Take a linter config and return list of resolved rules.
 *
 * @param {Object} rulesConfig
 *
 * @return {Array<RuleDefinition>}
 */
Linter.prototype.resolveRules = function(rulesConfig) {
  return Promise.all(
    Object.entries(rulesConfig).map(([ name, value ]) => {

      return this.resolveRule(name).then(function(rule) {
        return {
          value,
          name,
          rule
        };
      });
    })
  );
};


/**
 * Lint the given model root, using the specified linter config.
 *
 * @param {ModdleElement} moddleRoot
 * @param {Object} config rule config
 *
 * @return {Object} lint results, keyed by category names
 */
Linter.prototype.lint = function(moddleRoot, config) {

  // load rules
  return this.resolveRules(config.rules || []).then((ruleDefinitions) => {

    const finalReport = {};

    ruleDefinitions.forEach(({ rule, name, value }) => {

      const {
        ruleFlag,
        ruleConfig
      } = this.parseRuleValue(value);

      const ruleResults = this.applyRule({ moddleRoot, ruleFlag, rule, ruleConfig });

      Object.entries(ruleResults).forEach(([category, reports]) => {
        finalReport[category] = (finalReport[category] || []).concat(reports);
      });
    });

    return finalReport;
  });
};


Linter.prototype.parseRuleValue = function(value) {

  let ruleFlag;
  let ruleConfig;

  if (Array.isArray(value)) {
    ruleFlag = value[0];
    ruleConfig = value[1];
  } else {
    ruleFlag = value;
    ruleConfig = {};
  }

  return {
    ruleConfig,
    ruleFlag
  };
};