import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-implicit-split.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-implicit-split', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-split/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-split/valid-default-conditional-flow.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-split/invalid-event.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-split/invalid-task.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-split/invalid-call-activity.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    }
  ]
});