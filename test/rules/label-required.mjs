import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/label-required.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


const message = 'Element is missing label/name';


RuleTester.verify('label-required', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./label-required/valid-boundary-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./label-required/valid-conditional-flow.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./label-required/valid-data-objects.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./label-required/valid-gateways.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./label-required/valid-start-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./label-required/valid-participant-lanes.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./label-required/invalid-conditional-flow.bpmn', import.meta.url)),
      report: {
        id: 'ConditionalFlow',
        message,
        path: [ 'name' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./label-required/invalid-event.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./label-required/invalid-gateway-split.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./label-required/invalid-participant.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./label-required/invalid-lane.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    },
    {
      moddleElement: readModdle(new URL('./label-required/invalid-task.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    },{
      moddleElement: readModdle(new URL('./label-required/invalid-boundary-event.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message,
        path: [ 'name' ]
      }
    }
  ]
});