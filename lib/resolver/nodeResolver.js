module.exports = {

  resolveRule(ruleName) {
    const rulePath = this.getRulePath(ruleName);

    return require(rulePath);
  },

  resolveConfig(configName) {
    const parsed = parseConfigName(configName);

    const config = require(parsed.path);

    if (parsed.nestedName) {
      return config[parsed.nestedName];
    } else {
      return config;
    }
  },

  getRulePath(ruleName) {
    const parsed = parseRuleName(ruleName);

    return `${parsed.pkg}/rules/${parsed.ruleName}`;
  },

  getConfigPath(configName) {
    const parsed = parseConfigName(configName);

    return `${parsed.pkg}/rules/${parsed.ruleName}`;
  }

};


function parseRuleName(ruleName) {

  const slashIdx = ruleName.indexOf('/');

  if (slashIdx !== -1) {
    return {
      pkg: ruleName.substring(0, slashIdx),
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

  const match = /(plugin:)?(?:([^/])+)?(.+)/.exec(configName);

  console.log(match);

  return {
    rules: []
  };

  /*
  let isExternal = configName.startsWith(PLUGIN);

  if (isExternal) {
    configName = configName.substring(PLUGIN.length);
  }

  // plugin:camunda/recommended
  // bpmnlint:recommended
  const slashIdx = configName.indexOf('/');

  if (slashIdx !== -1) {
    return {
      pkg: configName.substring(0, slashIdx),
      configName: configName.substring(slashIdx + 1)
    };
  } else {
    return {
      pkg: '../..',
      configName
    };
  }
  */

}