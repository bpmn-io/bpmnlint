const {
  is
} = require('bpmnlint-utils');

/**
 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
 *
 * @typedef { import('../lib/types.js').RuleFactory } RuleFactory
 */


/**
 * Create a checker that disallows the given element type.
 *
 * @param { string } type
 *
 * @return { RuleFactory } ruleFactory
 */
function disallowNodeType(type) {

  /**
   * @type { RuleFactory }
   */
  return function() {

    function check(node, reporter) {

      if (is(node, type)) {
        reporter.report(node.id, 'Element has disallowed type <' + type + '>');
      }
    }

    return {
      check
    };

  };

}

module.exports.disallowNodeType = disallowNodeType;


/**
 * Find a parent for the given element
 *
 * @param { ModdleElement } node
 * @param { string } type
 *
 * @return { ModdleElement } element
 */
function findParent(node, type) {
  if (!node) {
    return null;
  }

  const parent = node.$parent;

  if (!parent) {
    return node;
  }

  if (is(parent, type)) {
    return parent;
  }

  return findParent(parent, type);
}

module.exports.findParent = findParent;