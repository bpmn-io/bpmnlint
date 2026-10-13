import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/conditional-flows.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('conditional-flows', rule, {
  valid: [
    {
      name: 'split',
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-split.bpmn')
    },
    {
      name: 'split after task',
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-split-after-task.bpmn')
    },
    {
      name: 'conditional fork',
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-conditional-fork.bpmn')
    },
    {
      name: 'no condition after merge',
      moddleElement: readModdle(__dirname + '/conditional-flows/valid-no-condition-after-merge.bpmn')
    }
  ],
  invalid: [
    {
      name: 'fork after exclusive gateway',
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-exclusive-gateway.bpmn'),
      report: {
        id: 'Flow_2',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after exclusive gateway default',
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-exclusive-gateway-default.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after task',
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-task.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    },
    {
      name: 'fork after task default',
      moddleElement: readModdle(__dirname + '/conditional-flows/invalid-fork-after-task-default.bpmn'),
      report: {
        id: 'Flow_1',
        message: 'Sequence flow is missing condition',
        path: [ 'conditionExpression' ]
      }
    }
  ]
});