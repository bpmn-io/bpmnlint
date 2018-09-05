// verify that start events inside an event sub-process
// are typed.

module.exports = function(utils) {

  const is = utils.is;

  function check(node, reporter) {

    if (!is(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
      return;
    }

    node.flowElements.forEach(function(flowElement) {

      if (!is(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      if (eventDefinitions.length === 0) {
        reporter.report(flowElement.id, 'is missing event definition');
      }
    });
  }

  return {
    check
  };

};