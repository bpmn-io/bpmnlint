const checkDiscouragedNodeType = require('./helper').checkDiscouragedNodeType;

module.exports = checkDiscouragedNodeType('bpmn:ComplexGateway', 'no-complex-gateway');