const {
  is
} = require('bpmnlint-utils');


/**
 * A rule that verifies that an event contains maximum one event definition.
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:Event')) {
      return;
    }

    const eventDefinitions = node.eventDefinitions || [];

    if (eventDefinitions.length > 1) {
      reporter.report({
        id: node.id,
        message: 'Event has multiple event definitions',
        path: [ 'eventDefinitions' ]
      });
    }
  }

  return {
    check
  };

};