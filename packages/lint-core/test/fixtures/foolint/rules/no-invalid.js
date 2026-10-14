module.exports = function() {

  return {
    check(node, reporter) {
      if (node.xml.includes('invalid')) {
        reporter.report(node.id, 'Root is invalid');
      }
    }
  };
};
