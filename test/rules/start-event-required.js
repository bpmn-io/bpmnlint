import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/start-event-required';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('start-event-required', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/start-event-required/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/valid-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/start-event-required/invalid.bpmn'),
      report: {
        id: 'Process',
        message: 'Process is missing start event'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/invalid-sub-process.bpmn'),
      report: {
        id: 'SubProcess',
        message: 'Sub process is missing start event'
      }
    }
  ]
});