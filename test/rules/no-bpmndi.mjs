import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-bpmndi.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-bpmndi', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-sub-processes.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-data-object.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-error.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-extension-elements.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-signavio.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-complex.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-group.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-nested-boundary.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-lanes.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-multiple-nested-levels.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-empty.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-no-lanes.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/valid-message-flow.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/ignore-edge-without-bpmn-element.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-catch-event.bpmn'),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-sub-processes.bpmn'),
      report: {
        id: 'boundaryEvent_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-multiple-sub-processes.bpmn'),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-sequence-flow.bpmn'),
      report: {
        id: 'sequenceFlow',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-participant.bpmn'),
      report: {
        id: 'Participant_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-group.bpmn'),
      report: {
        id: 'Group_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-group.bpmn'),
      report: {
        id: 'Group_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-lane.bpmn'),
      report: {
        id: 'lane2',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-lane.bpmn'),
      report: {
        id: 'lane2',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-collapsed-pool.bpmn'),
      report: {
        id: 'participant1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-nested-boundary.bpmn'),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-multiple-nested-levels.bpmn'),
      report: {
        id: 'task1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-nested-lanes.bpmn'),
      report: {
        id: 'task1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-missing-nested-lane.bpmn'),
      report: {
        id: 'lane_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-missing-nested-lane-deep.bpmn'),
      report: {
        id: 'lane7',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-message-flow.bpmn'),
      report: {
        id: 'danglingMessageFlow',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-no-bpmn-diagram.bpmn'),
      report: {
        id: 'StartEvent_1',
        message: 'Element is missing bpmndi'
      }
    },
  ]
});
