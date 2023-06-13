const {
  is,
  isAny
} = require('bpmnlint-utils');


/**
 * A rule that checks that an element is not an implicit end (token sink).
 */
module.exports = function() {

  function isLinkEvent(node) {
    const eventDefinitions = node.eventDefinitions || [];

    return eventDefinitions.length && eventDefinitions.every(
      definition => is(definition, 'bpmn:LinkEventDefinition')
    );
  }

  function isImplicitEnd(node) {
    const outgoing = node.outgoing || [];

    if (is(node, 'bpmn:SubProcess') && node.triggeredByEvent) {
      return false;
    }

    if (is(node, 'bpmn:IntermediateThrowEvent') && isLinkEvent(node)) {
      return false;
    }

    if (is(node, 'bpmn:EndEvent')) {
      return false;
    }

    return outgoing.length === 0;
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
