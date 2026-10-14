/**
 * Rule that reports foo labels.
 */
module.exports = function() {

  function check(node, reporter) {
    if (/^foo/.test(node.name || '')) {
      reporter.report(node.id, 'Element has non-sense label <' + node.name + '>');
    }
  }

  return {
    check: check
  };
};