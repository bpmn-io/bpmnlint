function isNodeOfType(node, type) {
  /**
   * Checks whether node is of specific bpmn type
   * @param {*} node
   * @param {*} type
   */
  return Boolean(
    node.$descriptor.allTypes.filter(({ name }) => `bpmn:${type}` === name)
      .length
  );
}

module.exports = {
  isNodeOfType
};
