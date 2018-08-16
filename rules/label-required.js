const ERROR = "Element is missing a label/name.";

module.exports = function labelRequired(node, reporter) {
  if (node.isNodeOfType("FlowNode") && !(node.name || "").trim().length) {
    reporter.report(node.id, ERROR);
  }
};
