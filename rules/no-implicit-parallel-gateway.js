const { isNodeOfType } = require("../lib/utils");

const ERROR = "Implicit parallel gateways are not allowed";

module.exports = function noImplicitParallelGateway(node, reporter) {
  if (!isNodeOfType(node, "Gateway") && (node.outgoing || []).length > 1) {
    reporter.report(node.id, ERROR);
  }
};
