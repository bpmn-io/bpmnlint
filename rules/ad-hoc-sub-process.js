const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that ensures that an Ad Hoc Sub Process is valid according to the BPMN spec:
 *
 * - No start or end events
 * - Every intermediate event has an outgoing sequence flow
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:AdHocSubProcess')) {
      return;
    }

    const flowElements = node.flowElements || [];

    flowElements.forEach(function(flowElement) {

      if (is(flowElement, 'bpmn:StartEvent')) {
        reporter.report(flowElement.id, 'A <Start Event> is not allowed in <Ad Hoc Sub Process>');
      }

      if (is(flowElement, 'bpmn:EndEvent')) {
        reporter.report(flowElement.id, 'An <End Event> is not allowed in <Ad Hoc Sub Process>');
      }

      if (is(flowElement, 'bpmn:IntermediateCatchEvent')) {
        if (!flowElement.outgoing || flowElement.outgoing.length === 0) {
          reporter.report(flowElement.id, 'An intermediate catch event inside <Ad Hoc Sub Process> must have an outgoing sequence flow');
        }
      }

    });
  }

  return annotateRule('ad-hoc-sub-process', {
    check
  });

};
