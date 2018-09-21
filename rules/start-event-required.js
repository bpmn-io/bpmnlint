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
      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, type + ' is missing start event');
    }
  }

  return { check };
};
