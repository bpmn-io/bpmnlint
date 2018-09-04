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
  this.cachedConfigs = {};
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

Linter.prototype.resolveConfig = function(name) {

  const config = this.cachedConfigs[name];

  if (config) {
    return Promise.resolve(config);
  }

  return Promise.resolve(this.resolver.resolveConfig(name)).then((config) => {

    if (!config) {
      throw new Error(`unknown config <${name}>`);
    }

    const actualConfig = this.cachedConfigs[name] = prefix(config, name);

    return actualConfig;
  });
};

/**
 * Take a linter config and return list of resolved rules.
 *
 * @param {Object} rulesConfig
 *
 * @return {Array<RuleDefinition>}
 */
Linter.prototype.resolveRules = function(config) {

  return this.resolveConfiguredRules(config).then((rulesConfig) => {
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
  });
};


Linter.prototype.resolveConfiguredRules = function(config) {

  let parents = config.extends;

  if (typeof parents === 'string') {
    parents = [ parents ];
  }

  if (typeof parents === 'undefined') {
    parents = [];
  }

  return Promise.all(
    parents.map((configName) => {
      return this.resolveConfig(configName).then((config) => {
        return this.resolveConfiguredRules(config);
      });
    })
  ).then((inheritedRules) => {

    const rules = [ ...inheritedRules, config.rules || [] ].reduce((rules, currentRules) => {
      return {
        ...rules,
        ...currentRules
      };
    }, {});

    return rules;
  });
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


// helpers ///////////////////////////

function prefix(config, configName) {

  let pkg;

  if (configName.indexOf('bpmnlint:') === 0) {
    pkg = 'bpmnlint';
  } else {
    pkg = configName.substring('plugin:'.length, configName.indexOf('/'));
  }

  const rules = config.rules || {};

  const prefixedRules = Object.keys(rules).reduce((prefixed, name) => {

    const value = rules[name];

    // prefix local rule definition
    if (name.indexOf('/') === -1) {
      name = `${pkg}/${name}`;
    }

    return {
      ...prefixed,
      [name]: value
    };
  }, {});

  return {
    ...config,
    rules: prefixedRules
  };
}