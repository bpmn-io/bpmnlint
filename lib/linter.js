const testRule = require("./testRule");

const flagsMap = {
  1: "warnings",
  2: "errors"
};

/**
 * Applies a rule on the moddleRoot and adds reports to the finalReport
 * @param {*} moddleRoot
 * @param {*} ruleName
 * @param {*} ruleFlagIdx
 */
function applyRule({ moddleRoot, ruleName, ruleFlagIdx }) {
  const rule = require(`../rules/${ruleName}`);
  const flagName = flagsMap[ruleFlagIdx];
  let reports = [];

  if (ruleFlagIdx) {
    reports = testRule({ moddleRoot, rule });
  }

  return { [flagName]: reports };
}

module.exports = async function linter({ moddleRoot, config }) {
  // final report that holds all lint reports
  const finalReport = { warnings: [], errors: [] };

  Object.entries(config).forEach(([ruleName, ruleFlagIdx]) => {
    const [flagName, reports] = Object.entries(
      applyRule({ moddleRoot, ruleName, ruleFlagIdx })
    )[0];

    finalReport[flagName] = (finalReport[flagName] || []).concat(reports);
  });

  return finalReport;
};
