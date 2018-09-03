const testRule = require("./testRule");
const utils = require("./utils");

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
function applyRule({ moddleRoot, ruleFlagIdx, rule }) {
  const flagName = flagsMap[ruleFlagIdx];
  let reports = [];

  if (ruleFlagIdx) {
    reports = testRule({ moddleRoot, rule });
  }

  return { [flagName]: reports };
}

module.exports = function linter({ moddleRoot, config }) {
  // final report that holds all lint reports
  const finalReport = { warnings: [], errors: [] };
  Object.entries(config).forEach(([ruleName, value]) => {
    let rule, ruleFlagIdx;

    if (typeof value === "object" && value !== null) {
      rule = require(value.path)(utils);
      ruleFlagIdx = value.flag;
    } else {
      try {
        rule = require(`../rules/bpmnlint-${ruleName}`)(utils);
      } catch (e) {
        try {
          rule = require(`../../bpmnlint-${ruleName}/index.js`)(utils);
        } catch (e) {
          console.error(`Couldn't find path to rule ${ruleName}.`);
        }
      }
      ruleFlagIdx = value;
    }

    const [flagName, reports] = Object.entries(
      applyRule({ moddleRoot, ruleFlagIdx, rule })
    )[0];

    finalReport[flagName] = (finalReport[flagName] || []).concat(reports);
  });

  return finalReport;
};
