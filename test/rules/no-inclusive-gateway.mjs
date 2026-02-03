import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-inclusive-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-inclusive-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-inclusive-gateway/valid.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-inclusive-gateway/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Gateway',
        message: 'Element type <bpmn:InclusiveGateway> is discouraged'
      }
    }
  ]
});