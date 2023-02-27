const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  getEventDefinition,
  skipInNonExecutableProcess
} = require('./helper');

module.exports = skipInNonExecutableProcess(function() {
  function check(node, reporter) {
    if (!isAny(node, [
      'bpmn:Activity',
      'bpmn:FlowElementsContainer'
    ])) {
      return;
    }

    const catchAllErrorEvents = [],
          catchAllEscalationEvents = [];

    // check process, sub-process
    if (is(node, 'bpmn:FlowElementsContainer')) {
      node.get('flowElements').forEach(flowElement => {
        if (is(flowElement, 'bpmn:SubProcess') && flowElement.get('triggeredByEvent')) {
          flowElement.get('flowElements').forEach(eventSubProcessFlowElement => {
            if (isCatchAllErrorEvent(eventSubProcessFlowElement)) {
              catchAllErrorEvents.push(eventSubProcessFlowElement);
            } else if (isCatchAllEscalationEvent(eventSubProcessFlowElement)) {
              catchAllEscalationEvents.push(eventSubProcessFlowElement);
            }
          });
        }
      });
    }

    // check call activity, sub-process, task
    if (is(node, 'bpmn:Activity')) {
      const parentNode = node.$parent;

      if (!parentNode) {
        return;
      }

      parentNode.get('flowElements').forEach(flowElement => {
        if (flowElement.get('attachedToRef') === node) {
          if (isCatchAllErrorEvent(flowElement)) {
            catchAllErrorEvents.push(flowElement);
          } else if (isCatchAllEscalationEvent(flowElement)) {
            catchAllEscalationEvents.push(flowElement);
          }
        }
      });
    }

    if (catchAllErrorEvents.length > 1) {
      catchAllErrorEvents.forEach(catchAllErrorEvent => {
        reporter.report(
          catchAllErrorEvent.get('id'),
          'More than one error event without error code in scope'
        );
      });
    }

    if (catchAllEscalationEvents.length > 1) {
      catchAllEscalationEvents.forEach(catchAllEscalationEvent => {
        reporter.report(
          catchAllEscalationEvent.get('id'),
          'More than one error event without escalation code in scope'
        );
      });
    }
  }

  return {
    check
  };
});

function isCatchAllErrorEvent(node) {
  if (!is(node, 'bpmn:CatchEvent')) {
    return false;
  }

  const eventDefinition = getEventDefinition(node);

  if (!eventDefinition || !is(eventDefinition, 'bpmn:ErrorEventDefinition')) {
    return false;
  }

  const errorRef = eventDefinition.get('errorRef');

  if (!errorRef) {
    return true;
  }

  return !errorRef.get('errorCode');
}

function isCatchAllEscalationEvent(node) {
  if (!is(node, 'bpmn:CatchEvent')
    || node.get('cancelActivity') === false
    || node.get('isInterrupting') === false) {
    return false;
  }

  const eventDefinition = getEventDefinition(node);

  if (!eventDefinition || !is(eventDefinition, 'bpmn:EscalationEventDefinition')) {
    return false;
  }

  const escalationRef = eventDefinition.get('escalationRef');

  if (!escalationRef) {
    return true;
  }

  return !escalationRef.get('escalationCode');
}