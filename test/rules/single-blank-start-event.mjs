import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/single-blank-start-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('single-blank-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-empty.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-end-event.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-sub-process.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-typed.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-typed-sub-process.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/valid-scopes.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Process',
        message: 'Process has multiple blank start events'
      }
    },
    {
      moddleElement: readModdle(new URL('./single-blank-start-event/invalid-sub-process.bpmn', import.meta.url)),
      report: {
        id: 'SubProcess',
        message: 'Sub process has multiple blank start events'
      }
    }
  ]
});