/**
 * Rule is to impose the presence of an end event in the process.
 */

module.exports = function(utils) {

  const is = utils.is;
  const isAny = utils.isAny;

  function hasEndEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'bpmn:EndEvent'))
    );
  }

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Process',
      'bpmn:SubProcess'
    ])) {
      return;
    }

    if (!hasEndEvent(node)) {
      reporter.report(node.id, 'is missing an end event');
    }
  }

  return { check };
};
