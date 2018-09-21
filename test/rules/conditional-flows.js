import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/conditional-flows';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('conditional-flows', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-split.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-split-after-task.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-conditional-fork.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-exclusive-gateway.bpmn'),
      report: {
        id: 'Flow_2',
        message: 'Sequence flow is missing condition'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-exclusive-gateway-default.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-task.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-task-default.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition'
      }
    }
  ]
});