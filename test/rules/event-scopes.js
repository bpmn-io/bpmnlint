import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/event-scopes';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('event-scopes', rule, {
  valid: [
    {
      name: 'error and escalation events',
      moddleElement: readModdle(__dirname + '/event-scopes/valid.bpmn')
    },
    {
      name: 'error events',
      moddleElement: readModdle(__dirname + '/event-scopes/valid-error-events.bpmn')
    },
    {
      name: 'escalation events',
      moddleElement: readModdle(__dirname + '/event-scopes/valid-escalation-events.bpmn')
    },
    {
      name: 'non-executable process',
      moddleElement: readModdle(__dirname + '/event-scopes/non-executable-process.bpmn')
    }
  ],
  invalid: [
    {
      name: 'error and escalation events',
      moddleElement: readModdle(__dirname + '/event-scopes/invalid.bpmn'),
      report: [
        {
          id: 'ErrorStartEvent_1',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'ErrorStartEvent_2',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'EscalationStartEvent_1',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'EscalationStartEvent_2',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'ErrorBoundaryEvent_1',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'ErrorBoundaryEvent_2',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'EscalationBoundaryEvent_1',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'EscalationBoundaryEvent_2',
          message: 'More than one error event without escalation code in scope'
        }
      ]
    },
    {
      name: 'error events',
      moddleElement: readModdle(__dirname + '/event-scopes/invalid-error-events.bpmn'),
      report: [
        {
          id: 'ErrorStartEvent_1',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'ErrorStartEvent_2',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'ErrorBoundaryEvent_1',
          message: 'More than one error event without error code in scope'
        },
        {
          id: 'ErrorBoundaryEvent_2',
          message: 'More than one error event without error code in scope'
        }
      ]
    },
    {
      name: 'escalation events',
      moddleElement: readModdle(__dirname + '/event-scopes/invalid-escalation-events.bpmn'),
      report: [
        {
          id: 'EscalationStartEvent_1',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'EscalationStartEvent_2',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'EscalationBoundaryEvent_1',
          message: 'More than one error event without escalation code in scope'
        },
        {
          id: 'EscalationBoundaryEvent_2',
          message: 'More than one error event without escalation code in scope'
        }
      ]
    }
  ]
});