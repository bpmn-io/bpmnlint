const { isNodeOfType } = require("../lib/utils");

const ERROR = "Element is missing a label/name.";

function check(node, reporter) {
  if (isNodeOfType(node, "FlowNode") && !(node.name || "").trim().length) {
    reporter.report(node, ERROR);
  }
}

module.exports = { check };
