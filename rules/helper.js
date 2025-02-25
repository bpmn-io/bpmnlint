const {
  is
} = require('bpmnlint-utils');

/**
 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
 *
 * @typedef { import('../lib/types.js').RuleFactory } RuleFactory
 * @typedef { import('../lib/types.js').RuleDefinition } RuleDefinition
 */


/**
 * Create a checker that disallows the given element type.
 *
 * @param { string } type
 *
 * @return { RuleFactory } ruleFactory
 */
function checkDiscouragedNodeType(type, ruleName) {

  /**
   * @type { RuleFactory }
   */
  return function() {

    function check(node, reporter) {

      if (is(node, type)) {
        reporter.report(node.id, 'Element type <' + type + '> is discouraged');
      }
    }

    return annotateRule(ruleName, {
      check
    });

  };

}

module.exports.checkDiscouragedNodeType = checkDiscouragedNodeType;


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


const documentationBaseUrl = 'https://github.com/bpmn-io/bpmnlint/blob/main/docs/rules';

/**
 * Annotate a rule with core information, such as the documentation url.
 *
 * @param {string} ruleName
 * @param {RuleDefinition} options
 *
 * @return {RuleDefinition}
 */
function annotateRule(ruleName, options) {

  const {
    meta: {
      documentation = {},
      ...restMeta
    } = {},
    ...restOptions
  } = options;

  const documentationUrl = `${documentationBaseUrl}/${ruleName}.md`;

  return {
    meta: {
      documentation: {
        url: documentationUrl,
        ...documentation
      },
      ...restMeta
    },
    ...restOptions
  };
}

module.exports.annotateRule = annotateRule;