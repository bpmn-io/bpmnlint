const testRule = require('./test-rule');
const utils = require('./utils');

const categoryMap = {
  0: 'off',
  1: 'warn',
  2: 'error'
};


function Linter(options = {}) {

  const {
    config,
    resolver
  } = options;

  if (typeof resolver === 'undefined') {
    throw new Error('must provide <options.resolver>');
  }

  this.config = config;
  this.resolver = resolver;

  this.cachedRules = {};
  this.cachedConfigs = {};
}


module.exports = Linter;

/**
 * Applies a rule on the moddleRoot and adds reports to the finalReport
 *
 * @param {ModdleElement} moddleRoot
 * @param {Rule} rule
 * @param {Object} ruleConfig
 *
 * @return {Array<ValidationErrors>} lint results
 */
Linter.prototype.applyRule = function applyRule(moddleRoot, rule, ruleConfig) {
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
 * @param {Object} config
 *
 * @return {Array<RuleDefinition>}
 */
Linter.prototype.resolveRules = function(config) {

  return this.resolveConfiguredRules(config).then((rulesConfig) => {

    // parse rule values
    const parsedRules = Object.entries(rulesConfig).map(([ name, value ]) => {
      const {
        category,
        config
      } = this.parseRuleValue(value);

      return {
        name,
        category,
        config
      };
    });

    // filter only for enabled rules
    const enabledRules = parsedRules.filter(definition => definition.category !== 'off');

    // load enabled rules
    const loaders = enabledRules.map((definition) => {

      const {
        name
      } = definition;

      return this.resolveRule(name).then(function(rule) {
        return {
          ...definition,
          rule
        };
      });
    });

    return Promise.all(loaders);
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
 * @param {Object} [config] the bpmnlint configuration to use
 *
 * @return {Object} lint results, keyed by category names
 */
Linter.prototype.lint = function(moddleRoot, config) {

  config = config || this.config;

  // load rules
  return this.resolveRules(config).then((ruleDefinitions) => {

    const finalReport = {};

    ruleDefinitions.forEach((ruleDefinition) => {

      const {
        rule,
        name,
        config,
        category
      } = ruleDefinition;

      const reports = this.applyRule(moddleRoot, rule, config);

      if (reports.length === 0) {
        return;
      }

      const categorizedReports = reports.map(function(report) {
        return {
          ...report,
          category
        };
      });

      finalReport[name] = categorizedReports;
    });

    return finalReport;
  });
};


Linter.prototype.parseRuleValue = function(value) {

  let category;
  let config;

  if (Array.isArray(value)) {
    category = value[0];
    config = value[1];
  } else {
    category = value;
    config = {};
  }

  // normalize rule flag to <error> and <warn> which
  // may be upper case or a number at this point
  if (typeof category === 'string') {
    category = category.toLowerCase();
  }

  category = categoryMap[category] || category;

  return {
    config,
    category
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