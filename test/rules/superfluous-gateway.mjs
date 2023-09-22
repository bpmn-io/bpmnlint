import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('superfluous-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/superfluous-gateway/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-gateway/valid-none-gateway.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/superfluous-gateway/invalid.bpmn'),
      report: {
        id: 'Gateway_1',
        message: 'Gateway is superfluous. It only has one source and target.'
      }
    }
  ]
});