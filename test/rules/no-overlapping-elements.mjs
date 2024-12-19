import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-overlapping-elements.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-overlapping-elements', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-boundary-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-collaboration.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-process.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-subprocess.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-subprocess-collapsed.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-data-objects.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/ignore-missing-di.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/ignore-missing-bounds.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-boundary-event.bpmn'),
      report: [
        {
          id: 'TASK',
          message: 'Element overlaps with other element'
        },
        {
          id: 'LOOKS_LIKE_BOUNDARY',
          message: 'Element overlaps with other element'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-collaboration.bpmn'),
      report: [
        {
          id: 'Participant_1af2hnr',
          message: 'Element overlaps with other element'
        },
        {
          id: 'Participant_06xnivi',
          message: 'Element overlaps with other element'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-process.bpmn'),
      report: [
        {
          id: 'TASK_1',
          message: 'Element overlaps with other element'
        },
        {
          id: 'TASK_2',
          message: 'Element overlaps with other element'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-subprocess.bpmn'),
      report: [
        {
          id: 'TASK',
          message: 'Element is outside of parent boundary'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-subprocess-collapsed.bpmn'),
      report: [
        {
          id: 'TASK',
          message: 'Element overlaps with other element'
        },
        {
          id: 'END_EVENT',
          message: 'Element overlaps with other element'
        }
      ]
    }
  ]
});
