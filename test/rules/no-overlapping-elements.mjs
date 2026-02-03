import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-overlapping-elements.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-overlapping-elements', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-boundary-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-collaboration.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-process.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-subprocess.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-subprocess-collapsed.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/valid-data-objects.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/ignore-missing-di.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/ignore-missing-bounds.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/invalid-boundary-event.bpmn', import.meta.url)),
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
      moddleElement: readModdle(new URL('./no-overlapping-elements/invalid-collaboration.bpmn', import.meta.url)),
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
      moddleElement: readModdle(new URL('./no-overlapping-elements/invalid-process.bpmn', import.meta.url)),
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
      moddleElement: readModdle(new URL('./no-overlapping-elements/invalid-subprocess.bpmn', import.meta.url)),
      report: [
        {
          id: 'TASK',
          message: 'Element is outside of parent boundary'
        }
      ]
    },
    {
      moddleElement: readModdle(new URL('./no-overlapping-elements/invalid-subprocess-collapsed.bpmn', import.meta.url)),
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
