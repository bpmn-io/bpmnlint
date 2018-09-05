import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/label-required';

import {
  readModdle
} from '../../lib/testers/helper';


const message = 'is missing label/name';


RuleTester.verify('label-required', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-boundary-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-conditional-flow.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-data-objects.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-gateways.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-start-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-participant-lanes.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-conditional-flow.bpmn'),
      report: {
        id: 'ConditionalFlow',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-event.bpmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-gateway-split.bpmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-participant.bpmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-lane.bpmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-task.bpmn'),
      report: {
        id: 'Element',
        message
      }
    }
  ]
});