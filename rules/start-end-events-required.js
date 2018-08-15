const {isNodeOfType} = require('../lib/utils');

const error = node => `Error: Element ${node.id} is missing a Start or End Event`;


function hasStartEndEvents(node) {
  let hasStartEvent = false;
  let hasEndEvent = false;

  node.flowElements.forEach(node => {
    if(isNodeOfType(node, 'StartEvent')) {
      hasStartEvent = true;
    }

    if(isNodeOfType(node, 'EndEvent')) {
      hasEndEvent = true;
    }
  });

  return hasStartEvent && hasEndEvent;
}

module.exports = function startEndEventsRequired(node, reporter) {
  if(isNodeOfType(node, 'Process')) {
    if(!hasStartEndEvents(node)) {
      reporter.report(node.id, error(node));
    }
  }
}