const {
  is
} = require('bpmnlint-utils');

/**
 * Create a checker that disallows the given element type.
 *
 * @param {String} type
 *
 * @return {Function} ruleImpl
 */
function disallowNodeType(type) {

  return function() {

    function check(node, reporter) {

      if (is(node, type)) {
        reporter.report(node.id, 'Element has disallowed type <' + type + '>');
      }
    }

    return {
      check
    };

  };

}

module.exports.disallowNodeType = disallowNodeType;

function getEventDefinition(node) {
  const eventDefinitions = node.get('eventDefinitions');

  if (eventDefinitions) {
    return eventDefinitions[ 0 ];
  }
}

module.exports.getEventDefinition = getEventDefinition;

function skipInNonExecutableProcess(ruleFactory) {
  return function(config = {}) {
    const rule = ruleFactory(config);

    function check(node, reporter) {
      if (isNonExecutableProcess(node)) {
        return false;
      }

      return rule.check(node, reporter);
    }

    return {
      ...rule,
      check
    };
  };
}

module.exports.skipInNonExecutableProcess = skipInNonExecutableProcess;

function isNonExecutableProcess(node) {
  let process;

  if (is(node, 'bpmn:Process')) {
    process = node;
  }

  if (is(node, 'bpmndi:BPMNPlane')
    && is(node.get('bpmnElement'), 'bpmn:Process')) {
    process = node.get('bpmnElement');
  }

  return process && !process.get('isExecutable');
}