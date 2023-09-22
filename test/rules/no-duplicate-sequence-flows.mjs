import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-duplicate-sequence-flows.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-duplicate-sequence-flows', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-sequence-flows/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-sequence-flows/invalid-no-condition.bpmn'),
      report: [
        {
          id: 'SequenceFlow_2',
          message: 'SequenceFlow is a duplicate'
        },
        {
          id: 'StartEvent_1',
          message: 'Duplicate outgoing sequence flows'
        },
        {
          id: 'Task_2',
          message: 'Duplicate incoming sequence flows'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-sequence-flows/invalid-condition.bpmn'),
      report: [
        {
          id: 'SequenceFlow_1',
          message: 'SequenceFlow is a duplicate'
        },
        {
          id: 'Task_1',
          message: 'Duplicate outgoing sequence flows'
        },
        {
          id: 'Task_2',
          message: 'Duplicate incoming sequence flows'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-sequence-flows/invalid-multiple.bpmn'),
      report: [
        {
          id: 'SequenceFlow_2',
          message: 'SequenceFlow is a duplicate'
        },
        {
          id: 'Task_1',
          message: 'Duplicate outgoing sequence flows'
        },
        {
          id: 'Task_2',
          message: 'Duplicate incoming sequence flows'
        },
        {
          id: 'SequenceFlow_3',
          message: 'SequenceFlow is a duplicate'
        }
      ]
    }
  ]
});