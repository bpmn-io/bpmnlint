import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/event-based-gateway.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('event-based-gateway', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/event-based-gateway/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/event-based-gateway/invalid-no-outgoing.bpmn'),
      report: {
        id: 'Gateway_1',
        message: 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flow>'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/event-based-gateway/invalid-one-outgoing.bpmn'),
      report: {
        id: 'Gateway_1',
        message: 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flow>'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/event-based-gateway/invalid-conditional-flow.bpmn'),
      report: {
        id: 'Flow_2',
        message: 'A <Sequence Flow> outgoing from an <Event-based Gateway> must not be conditional'
      }
    }
  ]
});
