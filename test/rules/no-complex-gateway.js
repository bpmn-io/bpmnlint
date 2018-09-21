import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-complex-gateway';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-complex-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-complex-gateway/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-complex-gateway/invalid.bpmn'),
      report: {
        id: 'Gateway',
        message: 'Element has disallowed type <bpmn:ComplexGateway>'
      }
    }
  ]
});