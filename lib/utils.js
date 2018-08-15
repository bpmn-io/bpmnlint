function isNodeOfType (node, type) {
  return Boolean(node.$descriptor.allTypes.filter(({name}) => `bpmn:${type}` === name).length);
}

module.exports = {
  isNodeOfType
}