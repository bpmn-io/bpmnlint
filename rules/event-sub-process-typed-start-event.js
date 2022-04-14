const {
  is
} = require('bpmnlint-utils');

/**
 * A rule that checks that start events inside an event sub-process
 * are typed.
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
      return;
    }

    const flowElements = node.flowElements || [];

    flowElements.forEach(function(flowElement) {

      if (!is(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      if (eventDefinitions.length === 0) {
        reporter.report({
          id: flowElement.id,
          message: 'Start event is missing event definition',
          path: [ 'eventDefinitions' ]
        });
      }
    });
  }

  return {
    check
  };

};