import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-implicit-end.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-implicit-end', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-end/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-end/valid-compensation.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-end/valid-collaboration.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-end/invalid.bpmn', import.meta.url)),
      report: [
        {
          id: 'INTERMEDIATE_THROW_EVENT',
          message: 'Element is an implicit end'
        },
        {
          id: 'TASK',
          message: 'Element is an implicit end',
        },
        {
          id: 'GATEWAY',
          message: 'Element is an implicit end',
        },
        {
          id: 'START_EVENT',
          message: 'Element is an implicit end',
        },
        {
          id: 'SUB_PROCESS',
          message: 'Element is an implicit end',
        },
        {
          id: 'BOUNDARY',
          message: 'Element is an implicit end',
        },
        {
          id: 'INTERMEDIATE_CATCH_EVENT',
          message: 'Element is an implicit end'
        },
        {
          id: 'LINK_CATCH_EVENT',
          message: 'Element is an implicit end'
        }
      ]
    }
  ]
});