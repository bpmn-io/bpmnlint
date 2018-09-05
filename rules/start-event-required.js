/**
 * Rule is to impose the presence of a start event in the process.
 */

module.exports = function(utils) {

  const is = utils.is;
  const isAny = utils.isAny;

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
    ])) {
      return;
    }

    if (!hasStartEvent(node)) {
      reporter.report(node.id, 'is missing a start event');
    }
  }

  return { check };
};
