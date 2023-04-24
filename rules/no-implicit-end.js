const {
  is,
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that checks that an element is not an implicit end (token sink).
 */
module.exports = function() {

  function isImplicitEnd(node) {
    const outgoing = node.outgoing || [];

    return !is(node, 'bpmn:EndEvent') && outgoing.length === 0;
  }

  function check(node, reporter) {

    if (!isAny(node, [ 'bpmn:Event', 'bpmn:Activity', 'bpmn:Gateway' ])) {
      return;
    }

    if (isImplicitEnd(node)) {
      reporter.report(node.id, 'Element is an implicit end');
    }
  }

  return { check };
};
