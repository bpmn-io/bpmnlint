import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/event-based-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('event-based-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./event-based-gateway/valid.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./event-based-gateway/invalid-no-outgoing.bpmn', import.meta.url)),
      report: {
        id: 'Gateway_1',
        message: 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flows>'
      }
    },
    {
      moddleElement: readModdle(new URL('./event-based-gateway/invalid-one-outgoing.bpmn', import.meta.url)),
      report: {
        id: 'Gateway_1',
        message: 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flows>'
      }
    },
    {
      moddleElement: readModdle(new URL('./event-based-gateway/invalid-conditional-flow.bpmn', import.meta.url)),
      report: {
        id: 'Flow_2',
        message: 'A <Sequence Flow> outgoing from an <Event-based Gateway> must not be conditional'
      }
    }
  ]
});
