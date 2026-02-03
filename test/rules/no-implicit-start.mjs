import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-implicit-start.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-implicit-start', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-start/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-implicit-start/valid-collaboration.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-implicit-start/invalid.bpmn', import.meta.url)),
      report: [
        {
          id: 'END_EVENT',
          message: 'Element is an implicit start',
        },
        {
          id: 'INTERMEDIATE_THROW_EVENT',
          message: 'Element is an implicit start'
        },
        {
          id: 'TASK',
          message: 'Element is an implicit start',
        },
        {
          id: 'GATEWAY',
          message: 'Element is an implicit start',
        },
        {
          id: 'LINK_THROW',
          message: 'Element is an implicit start',
        },
        {
          id: 'INTERMEDIATE_CATCH_EVENT',
          message: 'Element is an implicit start',
        }
      ]
    }
  ]
});