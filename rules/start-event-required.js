const { isNodeOfType } = require("../lib/utils");

const ERROR = "is missing a Start Event";

function hasStartEvent(node) {
  return (
    node.flowElements.filter(
      node => node.$type !== "String" && isNodeOfType(node, "StartEvent")
    ).length > 0
  );
}

module.exports = function startEventRequired(node, reporter) {
  if (isNodeOfType(node, "Process")) {
    if (!hasStartEvent(node)) {
      reporter.report("Process", ERROR);
    }
  }
};
