const {
  groupBy
} = require('min-dash');

const {
  is,
  isAny
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * A rule that checks that no fake join is modeled by attempting
 * to give an element join semantics, i.e. a task or event with
 * multiple incoming flows, or a link catch event targeted by
 * multiple link throw events.
 *
 * Users should model a parallel joining gateway
 * to achieve the desired behavior.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (is(node, 'bpmn:FlowElementsContainer')) {
      checkLinks(node, reporter);
    }

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

  function checkLinks(container, reporter) {

    const links = (container.flowElements || []).filter(isLinkEvent);

    // links are resolved by name, per scope
    const names = groupBy(links.filter(getLinkName), getLinkName);

    for (const [ name, events ] of Object.entries(names)) {
      const throwEvents = events.filter(event => is(event, 'bpmn:ThrowEvent'));
      const catchEvents = events.filter(event => is(event, 'bpmn:CatchEvent'));

      // ignore ambiguous catch
      if (throwEvents.length > 1 && catchEvents.length === 1) {
        reporter.report(
          catchEvents[0].id,
          `Link throw events with link name <${ name }> do not join`
        );
      }
    }
  }

  return annotateRule('fake-join', {
    check
  });

};


// helpers /////////////////

function isLinkEvent(node) {
  return is(node, 'bpmn:Event') && !!getLinkDefinition(node);
}

function getLinkDefinition(linkEvent) {
  return (linkEvent.eventDefinitions || []).find(
    definition => is(definition, 'bpmn:LinkEventDefinition')
  );
}

function getLinkName(linkEvent) {
  return getLinkDefinition(linkEvent).name;
}