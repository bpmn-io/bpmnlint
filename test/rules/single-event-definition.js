import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/single-event-definition';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('single-event-definition', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/single-event-definition/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-event-definition/valid-blank.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/single-event-definition/invalid.bpmn'),
      report: {
        id: 'Event',
        message: 'Event has multiple event definitions',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});