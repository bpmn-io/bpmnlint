const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks the presence of a label.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (isAny(node, [
      'bpmn:ParallelGateway',
      'bpmn:EventBasedGateway'
    ])) {
      return;
    }

    // ignore joining gateways
    if (is(node, 'bpmn:Gateway') && !isForking(node)) {
      return;
    }

    // ignore sub-processes
    if (is(node, 'bpmn:SubProcess')) {

      // TODO(nikku): better ignore expanded sub-processes only
      return;
    }

    // ignore sequence flow without condition
    if (is(node, 'bpmn:SequenceFlow') && !hasCondition(node)) {
      return;
    }

    // ignore data objects and artifacts for now
    if (isAny(node, [
      'bpmn:FlowNode',
      'bpmn:SequenceFlow',
      'bpmn:Participant',
      'bpmn:Lane'
    ])) {

      const name = (node.name || '').trim();

      if (name.length === 0) {
        reporter.report(node.id, 'Element is missing label/name', [ 'name' ]);
      }
    }
  }

  return annotateRule('label-required', {
    check
  });
};


// helpers ////////////////////////

function isForking(node) {
  const outgoing = node.outgoing || [];

  return outgoing.length > 1;
}

function hasCondition(node) {
  return node.conditionExpression;
}