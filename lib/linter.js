const path = require("path");

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
function applyRule({ moddleRoot, ruleName, ruleFlagIdx, rulePath }) {
  const rule = require("../rules/bpmnlint-label-required")(utils);
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
  Object.entries(config).forEach(([ruleName, value]) => {
    let rulePath, ruleFlagIdx;

    if (typeof value === "object" && value !== null) {
      rulePath = value.path;
      ruleFlagIdx = value.flag;
    } else {
      try {
        rulePath = require.resolve(`../rules/bpmnlint-${ruleName}`);
      } catch (e) {
        try {
          rulePath = require.resolve(`bpmnlint-${ruleName}`);
        } catch (e) {
          console.error(`Couldn't find path to rule ${ruleName}.`);
        }
      }
      ruleFlagIdx = value;
    }

    const [flagName, reports] = Object.entries(
      applyRule({ moddleRoot, ruleName, ruleFlagIdx, rulePath })
    )[0];

    finalReport[flagName] = (finalReport[flagName] || []).concat(reports);
  });

  return finalReport;
};
