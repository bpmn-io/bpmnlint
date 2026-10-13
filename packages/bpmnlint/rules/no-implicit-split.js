const {
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks that no implicit split is modeled
 * starting from a task.
 *
 * Users should model the parallel splitting gateway
 * explicitly instead.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Activity',
      'bpmn:Event'
    ])) {
      return;
    }

    const outgoing = node.outgoing || [];

    const outgoingWithoutCondition = outgoing.filter((flow) => {
      return !hasCondition(flow) && !isDefaultFlow(node, flow);
    });

    if (outgoingWithoutCondition.length > 1) {
      reporter.report(node.id, 'Flow splits implicitly');
    }
  }

  return annotateRule('no-implicit-split', {
    check
  });

};


// helpers /////////////////////////////

function hasCondition(flow) {
  return !!flow.conditionExpression;
}

function isDefaultFlow(node, flow) {
  return node['default'] === flow;
}