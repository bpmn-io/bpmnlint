const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks that unconditional sequence flows do not
 * have a label.
 *
 * Labels are only meaningful on sequence flows forking out of
 * XOR/OR gateways, on conditional flows, and on default flows.
 * Anywhere else they duplicate information already conveyed by
 * the diagram.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:SequenceFlow')) {
      return;
    }

    const name = (node.name || '').trim();

    if (!name) {
      return;
    }

    if (hasCondition(node) || isDefaultFlow(node) || isGatewayFork(node)) {
      return;
    }

    reporter.report(node.id, 'Sequence flow has superfluous label', [ 'name' ]);
  }

  return annotateRule('superfluous-label', {
    check
  });

};


// helpers /////////////////////////////

function hasCondition(flow) {
  return !!flow.conditionExpression;
}

function isDefaultFlow(flow) {
  const source = flow.sourceRef;

  return source && source['default'] === flow;
}

function isGatewayFork(flow) {
  const source = flow.sourceRef;

  if (!source) {
    return false;
  }

  const isDecisionGateway = (
    is(source, 'bpmn:ExclusiveGateway') ||
    is(source, 'bpmn:InclusiveGateway')
  );

  return isDecisionGateway && (source.outgoing || []).length > 1;
}
