const { isNodeOfType } = require("../lib/utils");

const ERROR = "is missing an End Event";

function hasEndEvent(node) {
  return (
    node.flowElements.filter(node => isNodeOfType(node, "EndEvent")).length > 0
  );
}

module.exports = function endEventRequired(node, reporter) {
  if (isNodeOfType(node, "Process")) {
    if (!hasEndEvent(node)) {
      reporter.report("Process", ERROR);
    }
  }
};
