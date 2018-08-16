/**
 * Rule is to impose the presence of a start event in the process.
 */

module.exports = utils => {
  const { isNodeOfType } = utils;

  const ERROR = "is missing a Start Event";

  function hasStartEvent(node) {
    return (
      node.flowElements.filter(
        node => node.$type !== "String" && isNodeOfType(node, "StartEvent")
      ).length > 0
    );
  }

  function check(node, reporter) {
    if (isNodeOfType(node, "Process")) {
      if (!hasStartEvent(node)) {
        reporter.report("Process", ERROR);
      }
    }
  }

  return { check };
};
