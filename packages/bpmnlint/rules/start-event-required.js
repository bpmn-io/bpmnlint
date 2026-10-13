const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks for the presence of a start event per scope.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function hasStartEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'bpmn:StartEvent'))
    );
  }

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Process',
      'bpmn:SubProcess'
    ]) || is(node, 'bpmn:AdHocSubProcess')) {
      return;
    }

    if (!hasStartEvent(node)) {
      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, type + ' is missing start event');
    }
  }

  return annotateRule('start-event-required', {
    check
  });
};
