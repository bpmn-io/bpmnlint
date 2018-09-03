module.exports = {

  resolveRule(ruleName) {
    const { path } = this.parseRuleName(ruleName);

    return require(path);
  },

  resolveConfig(configName) {

    const {
      path,
      config
    } = this.parseConfigName(configName);

    const instance = require(path);

    if (config) {
      return instance.configs[config];
    } else {
      return instance;
    }
  },

  parseRuleName(ruleName) {
    const parsed = parseRuleName(ruleName);

    return {
      path: `${parsed.pkg}/rules/${parsed.ruleName}`
    };
  },

  parseConfigName(configName) {
    return parseConfigName(configName);
  }

};


function parseRuleName(ruleName) {

  const slashIdx = ruleName.indexOf('/');

  if (slashIdx !== -1) {
    return {
      pkg: 'bpmnlint-plugin-' + ruleName.substring(0, slashIdx),
      ruleName: ruleName.substring(slashIdx + 1)
    };
  } else {
    return {
      pkg: '../..',
      ruleName
    };
  }
}


function parseConfigName(configName) {

  if (configName === 'bpmnlint:recommended') {
    return {
      path: '../../config/recommended'
    };
  }

  if (configName === 'bpmnlint:all') {
    return {
      path: '../../config/all'
    };
  }

  const match = /^plugin:([^/]+)\/(.+)$/.exec(configName);

  if (!match) {
    throw new Error(`invalid config name <${ configName }>`);
  }

  return {
    path: 'bpmnlint-plugin-' + match[1],
    config: match[2]
  };
}