const {
  is
} = require('bpmnlint-utils');


/**
 * A rule that checks the presence of a label.
 */
module.exports = function() {

  function check(node, reporter) {

    const name = (node.name || '').trim();

    if (!name) {
      return;
    }

    // match joining gateways _AND_ unconditional
    // sequence flows only
    if (
      (is(node, 'bpmn:Gateway') && !isForking(node)) ||
      (is(node, 'bpmn:SequenceFlow') && !isConditional(node))
    ) {

      reporter.report(node.id, 'Element has superfluous label/name', [ 'name' ]);
    }

  }

  return { check };
};


// helpers ////////////////////////

function isForking(node) {
  const outgoing = (node && node.outgoing) || [];

  console.log('isForking', node, outgoing.length > 1);
  return outgoing.length > 1;
}

function isConditional(node) {
  const source = node.sourceRef;

  return (
    node.conditionExpression && !source['default'] === node
  );
}