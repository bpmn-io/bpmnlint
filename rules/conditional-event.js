const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * Ensures that a conditional event has a condition specified.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    const eventDefinition = getConditionalEventDefinition(node);

    if (!eventDefinition) {
      return;
    }

    if (!hasCondition(eventDefinition)) {
      reporter.report(node.id, 'Conditional event is missing a condition', [ 'condition' ]);
    }
  }

  return annotateRule('conditional-event', {
    check
  });

};

function getConditionalEventDefinition(node) {
  if (!is(node, 'bpmn:Event')) {
    return;
  }

  const eventDefinitions = node.eventDefinitions || [];
  return eventDefinitions.find(def => is(def, 'bpmn:ConditionalEventDefinition'));
}

function hasCondition(eventDefinition) {
  return !!eventDefinition.condition?.body;
}