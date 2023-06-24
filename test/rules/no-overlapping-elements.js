import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-overlapping-elements';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-overlapping-elements', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-boundary-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-collaboration.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/valid-single-process.bpmn')
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
      moddleElement: readModdle(__dirname + '/no-overlapping-elements/invalid-single-process.bpmn'),
      report: [
        {
          id: 'Activity_0pzet26',
          message: 'Element overlaps with other element'
        },
        {
          id: 'Activity_0iby6yw',
          message: 'Element overlaps with other element'
        }
      ]
    }
  ]
});