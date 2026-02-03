import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/end-event-required.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('end-event-required', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./end-event-required/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./end-event-required/valid-sub-process.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./end-event-required/valid-sub-process-sub-types.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./end-event-required/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Process',
        message: 'Process is missing end event'
      }
    },
    {
      moddleElement: readModdle(new URL('./end-event-required/invalid-sub-process.bpmn', import.meta.url)),
      report: {
        id: 'SubProcess',
        message: 'Sub process is missing end event'
      }
    },
    {
      moddleElement: readModdle(new URL('./end-event-required/invalid-sub-process-sub-types.bpmn', import.meta.url)),
      report: [
        {
          id: 'TRANSACTION',
          message: 'Sub process is missing end event'
        },
        {
          id: 'EVENT_SUBPROCESS',
          message: 'Sub process is missing end event'
        }
      ]
    }
  ]
});