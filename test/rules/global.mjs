import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/global.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('global', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./global/valid-error.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./global/valid-escalation.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./global/valid-message.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./global/valid-no-ref.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./global/invalid-error-missing-name.bpmn', import.meta.url)),
      report: {
        id: 'Error',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-escalation-missing-name.bpmn', import.meta.url)),
      report: {
        id: 'Escalation',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-message-missing-name.bpmn', import.meta.url)),
      report: {
        id: 'Message',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-signal-missing-name.bpmn', import.meta.url)),
      report: {
        id: 'Signal',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-error-missing-reference.bpmn', import.meta.url)),
      report: {
        id: 'Error',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-escalation-missing-reference.bpmn', import.meta.url)),
      report: {
        id: 'Escalation',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-message-missing-reference.bpmn', import.meta.url)),
      report: {
        id: 'Message',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-signal-missing-reference.bpmn', import.meta.url)),
      report: {
        id: 'Signal',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-error-duplicate-name.bpmn', import.meta.url)),
      report: [ {
        id: 'Error_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Error_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-escalation-duplicate-name.bpmn', import.meta.url)),
      report: [ {
        id: 'Escalation_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Escalation_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-message-duplicate-name.bpmn', import.meta.url)),
      report: [ {
        id: 'Message_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Message_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(new URL('./global/invalid-signal-duplicate-name.bpmn', import.meta.url)),
      report: [ {
        id: 'Signal_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Signal_2',
        message: 'Element name is not unique'
      } ]
    }
  ]
});