import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-bpmndi.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-bpmndi', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-sub-processes.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-data-object.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-error.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-extension-elements.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-signavio.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-complex.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-group.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-nested-boundary.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-lanes.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-multiple-nested-levels.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-empty.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-no-lanes.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/valid-message-flow.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/ignore-edge-without-bpmn-element.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-catch-event.bpmn', import.meta.url)),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-sub-processes.bpmn', import.meta.url)),
      report: {
        id: 'boundaryEvent_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-multiple-sub-processes.bpmn', import.meta.url)),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-sequence-flow.bpmn', import.meta.url)),
      report: {
        id: 'sequenceFlow',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-participant.bpmn', import.meta.url)),
      report: {
        id: 'Participant_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-group.bpmn', import.meta.url)),
      report: {
        id: 'Group_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-group.bpmn', import.meta.url)),
      report: {
        id: 'Group_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-lane.bpmn', import.meta.url)),
      report: {
        id: 'lane2',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-lane.bpmn', import.meta.url)),
      report: {
        id: 'lane2',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-collapsed-pool.bpmn', import.meta.url)),
      report: {
        id: 'participant1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-nested-boundary.bpmn', import.meta.url)),
      report: {
        id: 'boundaryEvent',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-multiple-nested-levels.bpmn', import.meta.url)),
      report: {
        id: 'task1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-nested-lanes.bpmn', import.meta.url)),
      report: {
        id: 'task1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-missing-nested-lane.bpmn', import.meta.url)),
      report: {
        id: 'lane_1',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-missing-nested-lane-deep.bpmn', import.meta.url)),
      report: {
        id: 'lane7',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-message-flow.bpmn', import.meta.url)),
      report: {
        id: 'danglingMessageFlow',
        message: 'Element is missing bpmndi'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-bpmndi/invalid-no-bpmn-diagram.bpmn', import.meta.url)),
      report: {
        id: 'StartEvent_1',
        message: 'Element is missing bpmndi'
      }
    },
  ]
});
