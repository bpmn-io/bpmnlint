import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-gateway-join-fork.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-gateway-join-fork', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-gateway-join-fork/valid-fork.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-gateway-join-fork/valid-join.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-gateway-join-fork/valid-fork-join-task.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-gateway-join-fork/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Gateway',
        message: 'Gateway forks and joins'
      }
    }
  ]
});