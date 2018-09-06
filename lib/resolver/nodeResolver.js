module.exports = {

  resolveRule(name) {
    const {
      pkg,
      ruleName
    } = this.parseRuleName(name);

    try {
      return require(`${pkg}/rules/${ruleName}`);
    } catch (err) {
      if (pkg === 'bpmnlint') {
        // attempt local require
        return require(`../../rules/${ruleName}`)
      }

      throw err;
    }
  },

  resolveConfig(name) {

    const {
      pkg,
      configName
    } = this.parseConfigName(name);

    // resolve config via $PKG/config/$NAME`
    try {
      return require(`${pkg}/config/${configName}`);
    } catch (err) {}

    // resolve built-in as local config via ../../config/$NAME`
    if (pkg === 'bpmnlint') {
      try {
        // attempt local require
        return require(`../../config/${configName}`)
      } catch (err) {}
    }

    // resolve config via $PKG.configs[$NAME]
    const instance = require(pkg);

    if ('configs' in instance) {
      if (configName in instance.configs) {
        return instance.configs[configName];
      }
    }

    throw new Error('cannot resolve rule <name>');
  },

  parseRuleName(name) {
    return parseRuleName(name);
  },

  parseConfigName(name) {
    return parseConfigName(name);
  }

};


function parseRuleName(name) {

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
}


function parseConfigName(name) {

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
}