const testRule = require("./testRule");
const utils = require("./utils");

const flagsMap = {
  1: "warnings",
  2: "errors",
  warn: "warnings",
  error: "errors"
};


function Linter(options = {}) {

  const {
    ruleResolver
  } = options;

  if (typeof ruleResolver === 'undefined') {
    throw new Error('must provide <options.ruleResolver>');
  }

  this.ruleResolver = ruleResolver;
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
  return Promise.resolve(this.ruleResolver.resolve(name)).then(function(rule) {

    if (!rule) {
      throw new Error(`unknown rule <${name}>`);
    }

    return rule;
  });
};

/**
 * Take a linter config and return list of resolved rules.
 *
 * @param {Object} config
 *
 * @return {Array<RuleDefinition>}
 */
Linter.prototype.resolveRules = function(config) {
  return Promise.all(
    Object.entries(config).map(([ name, config ]) => {

      return this.resolveRule(name).then(function(rule) {
        return {
          config,
          name,
          rule
        }
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
  return this.resolveRules(config).then((ruleDefinitions) => {

    const finalReport = {};

    ruleDefinitions.forEach(({ rule, name, config }) => {

      const {
        ruleFlag,
        ruleConfig
      } = this.parseRuleConfig(config);

      const ruleResults = this.applyRule({ moddleRoot, ruleFlag, rule, ruleConfig });

      Object.entries(ruleResults).forEach(([category, reports]) => {
        finalReport[category] = (finalReport[category] || []).concat(reports);
      });
    });

    return finalReport;
  });
};


Linter.prototype.parseRuleConfig = function(config) {

  let ruleFlag;
  let ruleConfig;

  if (Array.isArray(config)) {
    ruleFlag = config[0];
    ruleConfig = config[1];
  } else {
    ruleFlag = config;
    ruleConfig = {};
  }

  return {
    ruleConfig,
    ruleFlag
  };
}