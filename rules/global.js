const {
  isAny, is
} = require('bpmnlint-utils');


/**
 * A rule that verifies that global elements are properly used.
 *
 * Currently recognized global elements are:
 *
 *   * `bpmn:Error`
 *   * `bpmn:Escalation`
 *   * `bpmn:Signal`
 *   * `bpmn:Message`
 *
 * For each of these elements proper usage implies:
 *
 *   * element must have a name
 *   * element is used (referenced) from event definitions
 *   * there exists only a single element per type with a given name
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:Definitions')) {
      return false;
    }

    const events = getEvents(node);
    const eventDefinitions = getEventDefinitions(node);

    events.forEach(event => {
      if (!hasName(event)) {
        reporter.report(event.id, 'Element is missing name');
      }

      if (!isReferenced(event, eventDefinitions)) {
        reporter.report(event.id, 'Element is unused');
      }

      if (!isUnique(event, events)) {
        reporter.report(event.id, 'Element name is not unique');
      }
    });

  }

  return {
    check
  };

  // helpers /////////////////////////////

  function getEvents(definition) {
    return definition.rootElements.filter(node => isAny(node, [ 'bpmn:Error', 'bpmn:Escalation', 'bpmn:Message', 'bpmn:Signal' ]));
  }

  function getEventDefinitions(definition) {
    const eventDefinitions = [];

    function traverse(element) {
      if (element.rootElements) {
        element.rootElements.forEach(traverse);
      }

      if (element.flowElements) {
        element.flowElements.forEach(traverse);
      }

      if (element.eventDefinitions) {
        element.eventDefinitions.forEach(eventDefinition => eventDefinitions.push(eventDefinition));
      }
    }

    traverse(definition);
    return eventDefinitions;
  }

  function hasName(event) {
    return (
      event.name?.trim() !== ''
    );
  }

  function isReferenced(event, eventDefinitions) {
    if (is(event, 'bpmn:Error')) {
      return (
        eventDefinitions.some(node => is(node, 'bpmn:ErrorEventDefinition') && event.id === node.errorRef?.id)
      );
    }

    if (is(event, 'bpmn:Escalation')) {
      return (
        eventDefinitions.some(node => is(node, 'bpmn:EscalationEventDefinition') && event.id === node.escalationRef?.id)
      );
    }

    if (is(event, 'bpmn:Message')) {
      return (
        eventDefinitions.some(node => is(node, 'bpmn:MessageEventDefinition') && event.id === node.messageRef?.id)
      );
    }

    if (is(event, 'bpmn:Signal')) {
      return (
        eventDefinitions.some(node => is(node, 'bpmn:SignalEventDefinition') && event.id === node.signalRef?.id)
      );
    }
  }

  function isUnique(event, events) {
    return (
      events.filter(node => is(node, event.$type) && event.name === node.name).length === 1
    );
  }
};