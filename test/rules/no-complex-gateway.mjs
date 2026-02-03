import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-complex-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-complex-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-complex-gateway/valid.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-complex-gateway/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Gateway',
        message: 'Element type <bpmn:ComplexGateway> is discouraged'
      }
    }
  ]
});