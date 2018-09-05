// verify that there exists no disconnected
// flow elements, i.e. elements without incoming
// _or_ outgoing sequence flows

module.exports = function(utils) {

  const isAny = utils.isAny;

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Task',
      'bpmn:Gateway',
      'bpmn:SubProcess',
      'bpmn:Event'
    ])) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (!incoming.length && !outgoing.length) {
      reporter.report(node.id, 'is not connected');
    }
  }

  return {
    check
  };

};