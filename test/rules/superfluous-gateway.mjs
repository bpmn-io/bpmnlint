import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('superfluous-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./superfluous-gateway/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./superfluous-gateway/valid-none-gateway.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./superfluous-gateway/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Gateway_1',
        message: 'Gateway is superfluous. It only has one source and target.'
      }
    }
  ]
});