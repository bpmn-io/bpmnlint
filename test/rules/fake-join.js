import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/fake-join';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('fake-join', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/fake-join/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/valid-gateway.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/fake-join/invalid.bpmn'),
      report: {
        id: 'Element',
        message: 'Incoming flows do not join'
      }
    }
  ]
});