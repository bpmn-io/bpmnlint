import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-complex-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


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
        message: 'Element type <bpmn:ComplexGateway> is discouraged'
      }
    }
  ]
});