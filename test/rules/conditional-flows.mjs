import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/conditional-flows.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('conditional-flows', rule, {
  valid: [
    {
      name: 'split',
      moddleElement: readModdle(new URL('./conditional-flows/valid-split.bpmn', import.meta.url))
    },
    {
      name: 'split after task',
      moddleElement: readModdle(new URL('./conditional-flows/valid-split-after-task.bpmn', import.meta.url))
    },
    {
      name: 'conditional fork',
      moddleElement: readModdle(new URL('./conditional-flows/valid-conditional-fork.bpmn', import.meta.url))
    },
    {
      name: 'no condition after merge',
      moddleElement: readModdle(new URL('./conditional-flows/valid-no-condition-after-merge.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      name: 'fork after exclusive gateway',
      moddleElement: readModdle(new URL('./conditional-flows/invalid-fork-after-exclusive-gateway.bpmn', import.meta.url)),
      report: {
        id: 'Flow_2',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after exclusive gateway default',
      moddleElement: readModdle(new URL('./conditional-flows/invalid-fork-after-exclusive-gateway-default.bpmn', import.meta.url)),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after task',
      moddleElement: readModdle(new URL('./conditional-flows/invalid-fork-after-task.bpmn', import.meta.url)),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after task default',
      moddleElement: readModdle(new URL('./conditional-flows/invalid-fork-after-task-default.bpmn', import.meta.url)),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    }
  ]
});