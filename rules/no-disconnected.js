const {
  isAny,
  is
} = require('bpmnlint-utils');


/**
 * A rule that verifies that there exists no disconnected
 * flow elements, i.e. elements without incoming
 * _or_ outgoing sequence flows
 */
module.exports = function() {

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Task',
      'bpmn:Gateway',
      'bpmn:SubProcess',
      'bpmn:Event'
    ]) || node.triggeredByEvent) {
      return;
    }

    // compensation activity and boundary events are
    // linked visually via associations. If these associations
    // exist we are fine, too
    if (isCompensationLinked(node)) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (!incoming.length && !outgoing.length) {
      reporter.report(node.id, 'Element is not connected');
    }
  }

  return {
    check
  };
};


// helpers /////////////////

function isCompensationBoundary(node) {

  var eventDefinitions = node.eventDefinitions;

  if (!is(node, 'bpmn:BoundaryEvent')) {
    return false;
  }

  if (!eventDefinitions || eventDefinitions.length !== 1) {
    return false;
  }

  return is(eventDefinitions[0], 'bpmn:CompensateEventDefinition');
}

function isCompensationActivity(node) {
  return node.isForCompensation;
}

function isCompensationLinked(node) {
  var source = isCompensationBoundary(node);
  var target = isCompensationActivity(node);

  // TODO(nikku): check, whether compensation association exists
  return source || target;
}