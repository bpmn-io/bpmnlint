const testRule = require('./testRule');
const utils = require('./utils');

const flagMap = {
  0: 'off',
  1: 'warn',
  2: 'error'
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
 * @param {String} options.ruleFlag
 * @param {Rule} options.rule
 * @param {Object} options.ruleConfig
 *
 * @return {Array<ValidationErrors>} lint results
 */
Linter.prototype.applyRule = function applyRule({ moddleRoot, ruleFlag, rule, ruleConfig }) {

  if (ruleFlag === 'off') {
    return [];
  }

  return testRule({ moddleRoot, rule, ruleConfig });
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

      const reports = this.applyRule({ moddleRoot, ruleFlag, rule, ruleConfig });

      if (reports.length === 0) {
        return;
      }

      const categorizedReports = reports.map(function(report) {
        return {
          ...report,
          category: ruleFlag
        };
      });

      finalReport[name] = categorizedReports;
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

  // normalize rule flag to <error> and <warn> which
  // may be upper case or a number at this point
  if (typeof ruleFlag === 'string') {
    ruleFlag = ruleFlag.toLowerCase();
  }

  ruleFlag = flagMap[ruleFlag] || ruleFlag;

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