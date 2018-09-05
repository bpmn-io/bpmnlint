// verify that no fake join is modeled by attempting
// to give a task or event join semantics.
//
// users should model a parallel joining gateway
// to achieve the desired behavior.

module.exports = function(utils) {

  const isAny = utils.isAny;

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Task',
      'bpmn:Event'
    ])) {
      return;
    }

    const incoming = node.incoming || [];

    if (incoming.length > 1) {
      reporter.report(node.id, 'does not join');
    }
  }

  return {
    check
  };

};