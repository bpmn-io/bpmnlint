const disallowNodeType = require('./helper').disallowNodeType;

module.exports = disallowNodeType('bpmn:ComplexGateway', 'no-complex-gateway');