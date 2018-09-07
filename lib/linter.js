const testRule = require('./test-rule');
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

  const {
    pkg,
    ruleName
  } = this.parseRuleName(name);

  const id = `${pkg}-${ruleName}`;

  const rule = this.cachedRules[id];

  if (rule) {
    return Promise.resolve(rule);
  }

  return Promise.resolve(this.resolver.resolveRule(pkg, ruleName)).then((ruleFactory) => {

    if (!ruleFactory) {
      throw new Error(`unknown rule <${name}>`);
    }

    const rule = this.cachedRules[id] = ruleFactory(utils);

    return rule;
  });
};

Linter.prototype.resolveConfig = function(name) {

  const {
    pkg,
    configName
  } = this.parseConfigName(name);

  const id = `${pkg}-${configName}`;

  const config = this.cachedConfigs[id];

  if (config) {
    return Promise.resolve(config);
  }

  return Promise.resolve(this.resolver.resolveConfig(pkg, configName)).then((config) => {

    if (!config) {
      throw new Error(`unknown config <${name}>`);
    }

    const actualConfig = this.cachedConfigs[id] = normalizeConfig(config, pkg);

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

    const overrideRules = normalizeConfig(config, 'bpmnlint').rules;

    const rules = [ ...inheritedRules, overrideRules ].reduce((rules, currentRules) => {
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

Linter.prototype.parseRuleName = function(name) {

  const slashIdx = name.indexOf('/');

  // resolve rule as built-in, if unprefixed
  if (slashIdx === -1) {
    return {
      pkg: 'bpmnlint',
      ruleName: name
    };
  }

  const pkg = name.substring(0, slashIdx);
  const ruleName = name.substring(slashIdx + 1);

  if (pkg === 'bpmnlint') {
    return {
      pkg: 'bpmnlint',
      ruleName
    };
  } else {
    return {
      pkg: 'bpmnlint-plugin-' + pkg,
      ruleName
    };
  }
};


Linter.prototype.parseConfigName = function(name) {

  const localMatch = /^bpmnlint:(.*)$/.exec(name);

  if (localMatch) {
    return {
      pkg: 'bpmnlint',
      configName: localMatch[1]
    };
  }

  const pluginMatch = /^plugin:([^/]+)\/(.+)$/.exec(name);

  if (!pluginMatch) {
    throw new Error(`invalid config name <${ name }>`);
  }

  return {
    pkg: 'bpmnlint-plugin-' + pluginMatch[1],
    configName: pluginMatch[2]
  };
};


// helpers ///////////////////////////

/**
 * Validate and return validated config.
 *
 * @param  {Object} config
 * @param  {String} pkg
 *
 * @return {Object} validated config
 */
function normalizeConfig(config, pkg) {

  const rules = config.rules || {};

  const validatedRules = Object.keys(rules).reduce((normalizedRules, name) => {

    const value = rules[name];

    // prefix local rule definition
    if (name.indexOf('bpmnlint/') === 0) {
      name = name.substring('bpmnlint/'.length);
    }

    normalizedRules[name] = value;

    return normalizedRules;
  }, {});

  return {
    ...config,
    rules: validatedRules
  };
}