const checkDiscouragedNodeType = require('./helper').checkDiscouragedNodeType;

module.exports = checkDiscouragedNodeType('bpmn:InclusiveGateway', 'no-inclusive-gateway');