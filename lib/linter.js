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

module.exports = async function linter(sourcePath, config) {
  const totalReport = { warnings: [], errors: [] };

  const applyRule = function applyRule(source, ruleName, ruleFlagIdx) {
    const rule = require(`../rules/${ruleName}`);
    return new Promise((resolve, reject) => {
      if (!ruleFlagIdx) {
        return resolve([]);
      }

      return moddle.fromXML(source, (err, root) => {
        if (err) {
          return reject(new Error("failed to parse XML", err));
        }

        const reports = testRule(root, rule);
        const flagName = flagsMap[ruleFlagIdx];
        totalReport[flagName] = (totalReport[flagName] || []).concat(reports);
        return resolve();
      });
    });
  };

  const source = await readFile(path.resolve(sourcePath), "utf-8");
  const rulesApplications = Object.entries(config).map(
    ([ruleName, ruleFlagIdx]) =>
      applyRule(source, ruleName, ruleFlagIdx, totalReport)
  );

  await Promise.all(rulesApplications);
  return totalReport;
};
