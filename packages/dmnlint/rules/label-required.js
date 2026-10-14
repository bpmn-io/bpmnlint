const {
  isAny
} = require('dmnlint-utils');


/**
 * A rule that checks the presence of a label.
 */
module.exports = function() {

  function check(node, reporter) {

    if (isAny(node, [
      'dmn:BusinessKnowledgeModel',
      'dmn:Decision',
      'dmn:InputData',
      'dmn:KnowledgeSource'
    ])) {

      const name = (node.name || '').trim();

      if (name.length === 0) {
        reporter.report(node.id, 'Element is missing label/name');
      }
    }
  }

  return { check };
};
