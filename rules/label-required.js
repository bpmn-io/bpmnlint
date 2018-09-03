/**
 * Rule is to impose the presence of a label for every flow node.
 */

module.exports = utils => {
  const { is } = utils;
  const ERROR = 'Element is missing a label/name.';

  function check(node, reporter) {

    if (is(node, 'bpmn:ParallelGateway')) {
      return;
    }

    if (is(node, 'bpmn:FlowNode') && !(node.name || '').trim().length) {
      reporter.report(node.id, ERROR);
    }
  }

  return { check };
};
