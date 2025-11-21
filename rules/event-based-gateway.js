const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks, whether an event-based gateway:
 * - has at least two outgoing sequence flows
 * - the outgoing sequence flows are not conditional
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:EventBasedGateway')) {
      return;
    }

    const outgoing = node.outgoing || [];

    if (outgoing.length < 2) {
      reporter.report(node.id, 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flows>');
    }

    outgoing.forEach((flow) => {
      if (hasCondition(flow)) {
        reporter.report(flow.id, 'A <Sequence Flow> outgoing from an <Event-based Gateway> must not be conditional');
      }
    });
  }

  return annotateRule('event-based-gateway', {
    check
  });
};

function hasCondition(flow) {
  return !!flow.conditionExpression;
}