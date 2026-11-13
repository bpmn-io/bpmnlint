const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * Warn about termination scoped to a single multi-instance subprocess iteration.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:EndEvent')) {
      return;
    }

    const parent = node.$parent;

    if (!parent || !is(parent, 'bpmn:SubProcess')) {
      return;
    }

    const loopCharacteristics = parent.loopCharacteristics;

    if (!loopCharacteristics || !is(loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')) {
      return;
    }

    const eventDefinitions = [
      ...(node.eventDefinitions || []),
      ...(node.eventDefinitionRef || [])
    ];

    if (eventDefinitions.some(definition => is(definition, 'bpmn:TerminateEventDefinition'))) {
      reporter.report(node.id, 'Termination affects only this multi-instance iteration; other iterations are not canceled.');
    }
  }

  return annotateRule('no-multi-instance-termination', {
    check
  });

};
