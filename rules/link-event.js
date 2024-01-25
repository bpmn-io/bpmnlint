const {
  groupBy
} = require('min-dash');

const {
  is
} = require('bpmnlint-utils');


/**
 * A rule that verifies that link events are properly used.
 *
 * This implies:
 *
 *   * for every link throw there exists a link catch within
 *     the same scope, and vice versa
 *   * there exists only a single pair of [ throw, catch ] links
 *     with a given name, per scope
 *   * link events have a name
 *
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:FlowElementsContainer')) {
      return;
    }

    const links = (node.flowElements || []).filter(isLinkEvent);

    for (const link of links) {
      if (!link.name) {
        reporter.report(link.id, 'Link event is missing name');
      }
    }

    const names = groupBy(links, (link) => link.name);

    for (const [ name, events ] of Object.entries(names)) {

      // ignore unnamed (validated earlier)
      if (!name) {
        continue;
      }

      // missing catch or throw event
      if (events.length === 1) {
        const event = events[0];

        reporter.report(event.id, `Link ${isThrowEvent(event) ? 'catch' : 'throw' } event with name <${ name }> missing in scope`);
      }

      const throwEvents = events.filter(isThrowEvent);

      if (throwEvents.length > 1) {
        for (const event of throwEvents) {
          reporter.report(event.id, `Duplicate link throw event with name <${name}> in scope`);
        }
      }

      const catchEvents = events.filter(isCatchEvent);

      if (catchEvents.length > 1) {
        for (const event of catchEvents) {
          reporter.report(event.id, `Duplicate link catch event with name <${name}> in scope`);
        }
      }
    }

  }

  return {
    check
  };
};


// helpers /////////////////

function isLinkEvent(node) {

  var eventDefinitions = node.eventDefinitions || [];

  if (!is(node, 'bpmn:Event')) {
    return false;
  }

  return eventDefinitions.some(
    definition => is(definition, 'bpmn:LinkEventDefinition')
  );
}

function isThrowEvent(node) {
  return is(node, 'bpmn:ThrowEvent');
}

function isCatchEvent(node) {
  return is(node, 'bpmn:CatchEvent');
}