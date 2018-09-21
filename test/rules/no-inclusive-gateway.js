import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-inclusive-gateway';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-inclusive-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-inclusive-gateway/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-inclusive-gateway/invalid.bpmn'),
      report: {
        id: 'Gateway',
        message: 'Element has disallowed type <bpmn:InclusiveGateway>'
      }
    }
  ]
});