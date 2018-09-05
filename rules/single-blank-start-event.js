// verify that there exists only a single blank
// start event per scope

module.exports = function(utils) {

  const is = utils.is;

  function check(node, reporter) {

    if (!is(node, 'bpmn:FlowElementsContainer')) {
      return;
    }

    const blankStartEvents = node.flowElements.filter(function(flowElement) {

      if (!is(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      return eventDefinitions.length === 0;
    });

    if (blankStartEvents.length > 1) {
      reporter.report(node.id, 'contains multiple blank start events');
    }
  }

  return {
    check
  };

};