import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-bpmndi';

import {
  readModdle
} from '../../lib/testers/helper';


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
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-catch-event.bpmn'),
      report: {
        id: 'Process',
        message: 'Element <boundaryEvent> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-sub-processes.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <boundaryEvent_1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-multiple-sub-processes.bpmn'),
      report: {
        id: 'Process_3',
        message: 'Element <boundaryEvent> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-sequence-flow.bpmn'),
      report: {
        id: 'Process',
        message: 'Element <sequenceFlow> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-participant.bpmn'),
      report: {
        id: 'Collaboration_1',
        message: 'Element <Participant_1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-group.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <Group_1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-group.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <Group_1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-lane.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <lane2> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-lane.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <lane2> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-collapsed-pool.bpmn'),
      report: {
        id: 'Collaboration1',
        message: 'Element <participant1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-nested-boundary.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <boundaryEvent> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-multiple-nested-levels.bpmn'),
      report: {
        id: 'Process_2',
        message: 'Element <task1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-nested-lanes.bpmn'),
      report: {
        id: 'Process_2',
        message: 'Element <task1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-missing-nested-lane.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <lane_1> is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-bpmndi/invalid-missing-nested-lane-deep.bpmn'),
      report: {
        id: 'Process_1',
        message: 'Element <lane7> is missing bpmndi'
      }
    }
  ]
});
