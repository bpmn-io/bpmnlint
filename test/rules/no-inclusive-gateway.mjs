import { verify } from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-inclusive-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.js';

const {
  __dirname
} = stubCJS(import.meta.url);


verify('no-inclusive-gateway', rule, {
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
        message: 'Element type <bpmn:InclusiveGateway> is discouraged'
      }
    }
  ]
});