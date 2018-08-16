const ERROR = "is missing an End Event";

function hasEndEvent(node) {
  return (
    node.flowElements.filter(node => node.isNodeOfType("EndEvent")).length > 0
  );
}

module.exports = function endEventRequired(node, reporter) {
  if (node.isNodeOfType("Process")) {
    if (!hasEndEvent(node)) {
      reporter.report("Process", ERROR);
    }
  }
};
