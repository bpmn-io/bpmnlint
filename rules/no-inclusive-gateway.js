const disallowNodeType = require('./helper').disallowNodeType;

module.exports = disallowNodeType('bpmn:InclusiveGateway', 'no-inclusive-gateway');