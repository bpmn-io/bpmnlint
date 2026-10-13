const {
  groupBy
} = require('min-dash');

const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


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
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:FlowElementsContainer')) {
      return;
    }

    const links = (node.flowElements || []).filter(isLinkEvent);

    for (const link of links) {
      if (!getLinkName(link)) {
        reporter.report(link.id, 'Link event is missing link name');
      }
    }

    const names = groupBy(links, link => getLinkName(link));

    for (const [ name, events ] of Object.entries(names)) {

      // ignore unnamed (validated earlier)
      if (!name) {
        continue;
      }

      // missing catch or throw event
      if (events.length === 1) {
        const event = events[0];

        reporter.report(event.id, `Link ${isThrowEvent(event) ? 'catch' : 'throw' } event with link name <${ name }> missing in scope`);
        continue;
      }

      const catchEvents = events.filter(isCatchEvent);
      if (catchEvents.length > 1) {
        for (const event of catchEvents) {
          reporter.report(event.id, `Duplicate link catch event with link name <${name}> in scope`);
        }
      } else if (catchEvents.length === 0) {

        // all events in scope are throw events
        for (const event of events) {
          reporter.report(event.id, `Link catch event with link name <${ name }> missing in scope`);
        }
      }
    }

  }

  return annotateRule('link-event', {
    check
  });
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

function getLinkName(linkEvent) {
  return linkEvent.get('eventDefinitions').find(def => is(def, 'bpmn:LinkEventDefinition')).name;
}

function isThrowEvent(node) {
  return is(node, 'bpmn:ThrowEvent');
}

function isCatchEvent(node) {
  return is(node, 'bpmn:CatchEvent');
}