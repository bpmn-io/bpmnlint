import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-implicit-split';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-implicit-split', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/valid-default-conditional-flow.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/invalid-event.bpmn'),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/invalid-task.bpmn'),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    }
  ]
});