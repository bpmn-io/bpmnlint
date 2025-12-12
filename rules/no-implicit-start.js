const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');

/**
 * A rule that checks that an element is not an implicit start (token spawn).
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function isLinkEvent(node) {
    const eventDefinitions = node.eventDefinitions || [];

    return eventDefinitions.length && eventDefinitions.every(
      definition => is(definition, 'bpmn:LinkEventDefinition')
    );
  }

  function isForCompensation(node) {
    return node.isForCompensation;
  }

  function isImplicitStart(node) {
    const incoming = node.incoming || [];

    if (is(node, 'bpmn:Activity') && isForCompensation(node)) {
      return false;
    }

    if (is(node.$parent, 'bpmn:AdHocSubProcess')) {
      return false;
    }

    if (is(node, 'bpmn:SubProcess') && node.triggeredByEvent) {
      return false;
    }

    if (is(node, 'bpmn:IntermediateCatchEvent') && isLinkEvent(node)) {
      return false;
    }

    if (isAny(node, [ 'bpmn:StartEvent', 'bpmn:BoundaryEvent' ])) {
      return false;
    }

    return incoming.length === 0;
  }

  function check(node, reporter) {

    if (!isAny(node, [ 'bpmn:Event', 'bpmn:Activity', 'bpmn:Gateway' ])) {
      return;
    }

    if (isImplicitStart(node)) {
      reporter.report(node.id, 'Element is an implicit start');
    }
  }

  return annotateRule('no-implicit-start', {
    check
  });
};
