import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/single-event-definition.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('single-event-definition', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./single-event-definition/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-event-definition/valid-blank.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./single-event-definition/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Event',
        message: 'Event has multiple event definitions',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});