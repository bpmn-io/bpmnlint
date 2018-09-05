// verify that a gateway does not fork and join
// at the same time.

module.exports = function(utils) {

  const is = utils.is;

  function check(node, reporter) {

    if (!is(node, 'bpmn:Gateway')) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (incoming.length > 1 && outgoing.length > 1) {
      reporter.report(node.id, 'forks and joins');
    }
  }

  return {
    check
  };

};