/**
 * Rule that reports `camunda:ServiceTaskLike`.
 */
module.exports = function() {

  function check(node, reporter) {
    if (node.$instanceOf('camunda:ServiceTaskLike')) {
      reporter.report(node.id, 'Element is a camunda:ServiceTaskLike <' + node.name + '>');
    }
  }

  return {
    check: check
  };
};
