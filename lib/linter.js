const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const path = require("path");
const BpmnModdle = require("bpmn-moddle");

const testRule = require("./testRule");

const moddle = new BpmnModdle();

const flagsMap = {
  1: "warnings",
  2: "errors"
};

/**
 * Reads XML form path and return moddle object
 * @param {*} sourcePath
 */
async function getSourceModdle(sourcePath) {
  const source = await readFile(path.resolve(sourcePath), "utf-8");
  return new Promise((resolve, reject) => {
    moddle.fromXML(source, (err, root) => {
      if (err) {
        return reject(new Error("failed to parse XML", err));
      }

      return resolve(root);
    });
  });
}

/**
 * Applies a rule on the sourceModdle and adds reports to the finalReport
 * @param {*} sourceModdle
 * @param {*} ruleName
 * @param {*} ruleFlagIdx
 */
function applyRule(sourceModdle, ruleName, ruleFlagIdx) {
  const rule = require(`../rules/${ruleName}`);
  const flagName = flagsMap[ruleFlagIdx];
  let reports = [];

  if (ruleFlagIdx) {
    reports = testRule(sourceModdle, rule);
  }

  return { [flagName]: reports };
}

module.exports = async function linter(sourcePath, config) {
  // final report that holds all lint reports
  const finalReport = { warnings: [], errors: [] };

  const sourceModdle = await getSourceModdle(sourcePath);

  Object.entries(config).forEach(([ruleName, ruleFlagIdx]) => {
    const [flagName, reports] = Object.entries(
      applyRule(sourceModdle, ruleName, ruleFlagIdx)
    )[0];

    finalReport[flagName] = (finalReport[flagName] || []).concat(reports);
  });

  return finalReport;
};
