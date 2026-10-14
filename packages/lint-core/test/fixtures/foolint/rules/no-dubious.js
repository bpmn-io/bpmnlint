module.exports = function() {

  return {
    check(node, reporter) {
      if (node.xml.includes('dubious')) {

        // surface the loaded moddle extensions
        const extensions = node.flags.length ? ` (${ node.flags.join(', ') })` : '';

        reporter.report(node.id, 'Root is dubious' + extensions);
      }
    }
  };
};
