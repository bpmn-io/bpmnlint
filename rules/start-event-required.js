/**
 * Rule is to impose the presence of a start event in the process.
 */

module.exports = utils => {
  const { is } = utils;

  const ERROR = 'is missing a Start Event';

  function hasStartEvent(node) {
    return (
      (node.flowElements || []).filter(
        node => node.$type !== 'String' && is(node, 'bpmn:StartEvent')
      ).length > 0
    );
  }

  function check(node, reporter) {
    if (is(node, 'bpmn:Process')) {
      if (!hasStartEvent(node)) {
        reporter.report(node.id, ERROR);
      }
    }
  }

  return { check };
};
