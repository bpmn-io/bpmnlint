import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/sub-process-blank-start-event';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('sub-process-blank-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-empty.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-intermediate-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-event-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/invalid.bpmn'),
      report: {
        id: 'StartEvent',
        message: 'Start event must be blank',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});