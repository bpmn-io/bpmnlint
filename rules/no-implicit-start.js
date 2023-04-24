const {
  is,
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that checks that an element is not an implicit start (token spawn).
 */
module.exports = function() {

  function isImplicitStart(node) {
    const incoming = node.incoming || [];

    return !is(node, 'bpmn:StartEvent') && incoming.length === 0;
  }

  function check(node, reporter) {

    if (!isAny(node, [ 'bpmn:Event', 'bpmn:Activity', 'bpmn:Gateway' ])) {
      return;
    }

    if (isImplicitStart(node)) {
      reporter.report(node.id, 'Element is an implicit start');
    }
  }

  return { check };
};
