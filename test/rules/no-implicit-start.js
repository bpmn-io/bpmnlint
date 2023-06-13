import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-implicit-start';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-implicit-start', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-start/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-start/invalid.bpmn'),
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