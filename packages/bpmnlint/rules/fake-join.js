const {
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks that no fake join is modeled by attempting
 * to give a task or event join semantics.
 *
 * Users should model a parallel joining gateway
 * to achieve the desired behavior.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Activity',
      'bpmn:Event'
    ])) {
      return;
    }

    const incoming = node.incoming || [];

    if (incoming.length > 1) {
      reporter.report(node.id, 'Incoming flows do not join');
    }
  }

  return annotateRule('fake-join', {
    check
  });

};