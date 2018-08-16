module.exports = function nodeWithUtils(node) {
  /**
   * Checks whether node is of specific bpmn type
   * @param {*} node
   * @param {*} type
   */
  node.isNodeOfType = function isNodeOfType(type) {
    return Boolean(
      node.$descriptor.allTypes.filter(({ name }) => `bpmn:${type}` === name)
        .length
    );
  };

  return node;
};
