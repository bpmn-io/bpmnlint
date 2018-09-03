const testRule = require("./testRule");
const utils = require("./utils");

const flagsMap = {
  1: "warnings",
  2: "errors",
  WARN: "warnings",
  ERROR: "errors"
};

/**
 * Applies a rule on the moddleRoot and adds reports to the finalReport
 *
 * @param {*} moddleRoot
 * @param {*} ruleFlag
 * @param {*} rule
 */
module.exports.applyRule = function applyRule({ moddleRoot, ruleFlag, rule }) {

  const flagName = flagsMap[ruleFlag];
  let reports = [];

  if (flagName) {
    reports = testRule({ moddleRoot, rule });
  }

  return { [flagName]: reports };
}

module.exports.lint = function linter({ moddleRoot, config }) {
  // final report that holds all lint reports
  const finalReport = { warnings: [], errors: [] };
  Object.entries(config).forEach(([ruleName, value]) => {
    let rule, ruleFlag;

    if (typeof value === "object" && value !== null) {
      rule = require(value.path)(utils);
      ruleFlag = value.flag;
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
      ruleFlag = value;
    }

    const [flagName, reports] = Object.entries(
      applyRule({ moddleRoot, ruleFlag, rule })
    )[0];

    finalReport[flagName] = (finalReport[flagName] || []).concat(reports);
  });

  return finalReport;
};
