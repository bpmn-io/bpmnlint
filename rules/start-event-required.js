const ERROR = "is missing a Start Event";

function hasStartEvent(node) {
  return (
    node.flowElements.filter(node => node.isNodeOfType(node, "StartEvent"))
      .length > 0
  );
}

module.exports = function startEventRequired(node, reporter) {
  if (node.isNodeOfType("Process")) {
    if (!hasStartEvent(node)) {
      reporter.report("Process", ERROR);
    }
  }
};
