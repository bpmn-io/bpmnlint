const { isNodeOfType } = require("../lib/utils");

const ERROR = "is missing a Start Event";

function hasStartEvent(node) {
  return (
    node.flowElements.filter(
      node => node.$type !== "String" && isNodeOfType(node, "StartEvent")
    ).length > 0
  );
}

function check(node, reporter) {
  if (isNodeOfType(node, "Process")) {
    if (!hasStartEvent(node)) {
      reporter.report(node, ERROR);
    }
  }
}

module.exports = { check };
