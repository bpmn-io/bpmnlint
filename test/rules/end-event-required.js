import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/end-event-required';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('end-event-required', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/end-event-required/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/end-event-required/valid-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/end-event-required/invalid.bpmn'),
      report: {
        id: 'Process',
        message: 'Process is missing end event'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/end-event-required/invalid-sub-process.bpmn'),
      report: {
        id: 'SubProcess',
        message: 'Sub process is missing end event'
      }
    }
  ]
});