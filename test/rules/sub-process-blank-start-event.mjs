import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/sub-process-blank-start-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('sub-process-blank-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/valid-empty.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/valid-intermediate-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/valid-event-sub-process.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/invalid.bpmn', import.meta.url)),
      report: {
        id: 'StartEvent',
        message: 'Start event must be blank',
        path: [ 'eventDefinitions' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./sub-process-blank-start-event/invalid-ad-hoc.bpmn', import.meta.url)),
      report: {
        id: 'StartEvent',
        message: 'Start event must be blank',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});