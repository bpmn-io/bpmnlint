module.exports = {

  resolve(ruleName) {
    const rulePath = this.getRulePath(ruleName);

    return require(rulePath);
  },

  getRulePath(ruleName) {
    const parsed = parseRuleName(ruleName);

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