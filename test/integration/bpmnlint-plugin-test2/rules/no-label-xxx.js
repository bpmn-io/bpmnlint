/**
 * Rule that reports xxx labels.
 */
module.exports = function() {

  function check(node, reporter) {
    if (/^xxx/.test(node.name || '')) {
      reporter.report({
        id: node.id,
        message: 'Element has non-sense label <' + node.name + '>'
      });
    }
  }

  return {
    check: check
  };
};