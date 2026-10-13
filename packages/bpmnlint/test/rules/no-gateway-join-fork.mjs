import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-gateway-join-fork.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-gateway-join-fork', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-gateway-join-fork/valid-fork.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-gateway-join-fork/valid-join.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-gateway-join-fork/valid-fork-join-task.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-gateway-join-fork/invalid.bpmn'),
      report: {
        id: 'Gateway',
        message: 'Gateway forks and joins'
      }
    }
  ]
});