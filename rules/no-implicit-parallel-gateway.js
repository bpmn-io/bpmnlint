const ERROR = "Implicit parallel gateways are not allowed";

module.exports = function noImplicitParallelGateway(node, reporter) {
  if (!node.isNodeOfType("Gateway") && (node.outgoing || []).length > 1) {
    reporter.report(node.id, ERROR);
  }
};
