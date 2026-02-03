import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/event-sub-process-typed-start-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('event-sub-process-typed-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/valid-empty.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/valid-empty-sub-process.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/valid-intermediate-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/valid-sub-process.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./event-sub-process-typed-start-event/invalid.bpmn', import.meta.url)),
      report: {
        id: 'StartEvent',
        message: 'Start event is missing event definition',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});