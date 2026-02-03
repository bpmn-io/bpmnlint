import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/fake-join.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('fake-join', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./fake-join/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./fake-join/valid-gateway.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./fake-join/invalid-task.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Incoming flows do not join'
      }
    },
    {
      moddleElement: readModdle(new URL('./fake-join/invalid-callActivity.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Incoming flows do not join'
      }
    }
  ]
});