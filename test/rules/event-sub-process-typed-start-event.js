import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/event-sub-process-typed-start-event';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('event-sub-process-typed-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-intermediate-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/invalid.bpmn'),
      report: {
        id: 'StartEvent',
        message: 'is missing event definition'
      }
    }
  ]
});