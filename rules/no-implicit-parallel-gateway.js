const {isNodeOfType} = require('../lib/utils');

const ERROR = 'Implicit parallel gateways are not allowed';

module.exports = function noImplicitParallelGateway(node, reporter){
  if(isNodeOfType(node, 'Activity') && (node.outgoing || []).length > 1) {
    console.log(node.outgoing);
    reporter.report('Process', ERROR);
  }
}