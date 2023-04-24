import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-implicit-end';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-implicit-end', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-end/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-end/invalid.bpmn'),
      report: [
        {
          id: 'INTERMEDIATE_EVENT',
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
        }
      ]
    }
  ]
});