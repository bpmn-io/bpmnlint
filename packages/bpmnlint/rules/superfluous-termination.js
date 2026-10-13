const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks, whether a gateway has only one source and target.
 *
 * Those gateways are superfluous since they don't do anything.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!isAny(node, [ 'bpmn:Process', 'bpmn:SubProcess' ])) {
      return;
    }

    const flowElements = node.flowElements || [];

    const ends = flowElements.filter(
      element => is(element, 'bpmn:FlowNode') && (element.outgoing || []).length === 0
    );

    const terminateEnds = ends.filter(isTerminateEnd);

    if (terminateEnds.length !== 1) {

      // TODO(nikku): only detect basic cases, do not
      // do any kinds of elaborate flow analysis
      return;
    }

    const superfluous = ends.every(
      (end) => isInterruptingEventSub(end) || isTerminateEnd(end)
    );

    if (superfluous) {

      for (const node of terminateEnds) {
        reporter.report(node.id, 'Termination is superfluous.');
      }
    }
  }

  return annotateRule('superfluous-termination', {
    check
  });

};

function isTerminateEnd(element) {
  return is(element, 'bpmn:EndEvent') && (element.eventDefinitions || []).some(
    eventDefinition => is(eventDefinition, 'bpmn:TerminateEventDefinition')
  );
}

function isInterruptingEventSub(element) {
  const isEventSub = is(element, 'bpmn:SubProcess') && element.triggeredByEvent;

  return isEventSub && (element.flowElements || []).some(
    element => is(element, 'bpmn:StartEvent') && element.isInterrupting
  );
}