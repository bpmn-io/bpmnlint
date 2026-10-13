const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that verifies that global elements are properly used.
 *
 * Currently recognized global elements are:
 *
 *   * `bpmn:Error`
 *   * `bpmn:Escalation`
 *   * `bpmn:Message`
 *   * `bpmn:Signal`
 *
 * For each of these elements proper usage implies:
 *
 *   * element must have a name
 *   * element is referenced by at least one element
 *   * there exists only a single element per type with a given name
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:Definitions')) {
      return false;
    }

    const rootElements = getRootElements(node);

    const referencingElements = getReferencingElements(node);

    rootElements.forEach(rootElement => {
      if (!hasName(rootElement)) {
        reporter.report(rootElement.id, 'Element is missing name');
      }

      if (!isReferenced(rootElement, referencingElements)) {
        reporter.report(rootElement.id, 'Element is unused');
      }

      if (!isUnique(rootElement, rootElements)) {
        reporter.report(rootElement.id, 'Element name is not unique');
      }
    });

  }

  return annotateRule('global', {
    check
  });

  // helpers /////////////////////////////

  function getRootElements(definitions) {
    return definitions.rootElements.filter(node => isAny(node, [ 'bpmn:Error', 'bpmn:Escalation', 'bpmn:Message', 'bpmn:Signal' ]));
  }

  function getReferencingElements(definitions) {
    const referencingElements = [];

    function traverse(element) {
      if (is(element, 'bpmn:Definitions') && element.get('rootElements').length) {
        element.get('rootElements').forEach(traverse);
      }

      if (is(element, 'bpmn:FlowElementsContainer') && element.get('flowElements').length) {
        element.get('flowElements').forEach(traverse);
      }

      if (is(element, 'bpmn:Event') && element.get('eventDefinitions').length) {
        element.get('eventDefinitions').forEach(eventDefinition => referencingElements.push(eventDefinition));
      }

      if (is(element, 'bpmn:Collaboration') && element.get('messageFlows').length) {
        element.get('messageFlows').forEach(traverse);
      }

      if (isAny(element, [
        'bpmn:MessageFlow',
        'bpmn:ReceiveTask',
        'bpmn:SendTask'
      ])) {
        referencingElements.push(element);
      }
    }

    traverse(definitions);

    return referencingElements;
  }

  function hasName(event) {
    return (
      event.name?.trim() !== ''
    );
  }

  function isReferenced(rootElement, referencingElements) {
    if (is(rootElement, 'bpmn:Error')) {
      return referencingElements.some(referencingElement => {
        return is(referencingElement, 'bpmn:ErrorEventDefinition')
          && rootElement.get('id') === referencingElement.get('errorRef')?.get('id');
      });
    }

    if (is(rootElement, 'bpmn:Escalation')) {
      return referencingElements.some(referencingElement => {
        return is(referencingElement, 'bpmn:EscalationEventDefinition')
          && rootElement.get('id') === referencingElement.get('escalationRef')?.get('id');
      });
    }

    if (is(rootElement, 'bpmn:Message')) {
      return referencingElements.some(referencingElement => {
        return isAny(referencingElement, [
          'bpmn:MessageEventDefinition',
          'bpmn:MessageFlow',
          'bpmn:ReceiveTask',
          'bpmn:SendTask'
        ]) && rootElement.get('id') === referencingElement.get('messageRef')?.get('id');
      });
    }

    if (is(rootElement, 'bpmn:Signal')) {
      return referencingElements.some(referencingElement => {
        return is(referencingElement, 'bpmn:SignalEventDefinition')
          && rootElement.get('id') === referencingElement.get('signalRef')?.get('id');
      });
    }
  }

  function isUnique(rootElement, rootElements) {
    return (
      rootElements.filter(otherRootElement => is(otherRootElement, rootElement.$type) && rootElement.name === otherRootElement.name).length === 1
    );
  }
};