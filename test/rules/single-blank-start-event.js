import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/single-blank-start-event';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('single-blank-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-empty.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-end-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-sub-process.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-typed.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-typed-sub-process.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/valid-scopes.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/invalid.bpmn'),
      report: {
        id: 'Process',
        message: 'Process has multiple blank start events'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/single-blank-start-event/invalid-sub-process.bpmn'),
      report: {
        id: 'SubProcess',
        message: 'Sub process has multiple blank start events'
      }
    }
  ]
});