/**
 * Checks whether node is of specific bpmn type.
 *
 * @param {ModdleElement} node
 * @param {String} type
 *
 * @return {Boolean}
 */
function is(node, type) {

  if (type.indexOf(':') === -1) {
    type = 'bpmn:' + type;
  }

  return (
    (typeof node.$instanceOf === 'function')
      ? node.$instanceOf(type)
      : node.$type === type
  );
}

module.exports = {
  is
};
