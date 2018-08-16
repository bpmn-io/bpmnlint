const { isNodeOfType } = require("../lib/utils");

const ERROR = "Element is missing a label/name.";

module.exports = function labelRequired(node, reporter) {
  if (isNodeOfType(node, "FlowNode") && !(node.name || "").trim().length) {
    reporter.report(node.id, ERROR);
  }
};
