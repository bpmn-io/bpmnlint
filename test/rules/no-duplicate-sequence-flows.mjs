import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-duplicate-sequence-flows.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-duplicate-sequence-flows', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-duplicate-sequence-flows/valid.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-duplicate-sequence-flows/invalid-no-condition.bpmn', import.meta.url)),
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
      moddleElement: readModdle(new URL('./no-duplicate-sequence-flows/invalid-condition.bpmn', import.meta.url)),
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
      moddleElement: readModdle(new URL('./no-duplicate-sequence-flows/invalid-multiple.bpmn', import.meta.url)),
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