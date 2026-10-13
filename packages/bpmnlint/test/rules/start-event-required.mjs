import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/start-event-required.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('start-event-required', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/start-event-required/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/valid-sub-process.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/valid-sub-process-sub-types.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/start-event-required/invalid.bpmn'),
      report: {
        id: 'Process',
        message: 'Process is missing start event'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/invalid-sub-process.bpmn'),
      report: {
        id: 'SubProcess',
        message: 'Sub process is missing start event'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/start-event-required/invalid-sub-process-sub-types.bpmn'),
      report: [
        {
          id: 'TRANSACTION',
          message: 'Sub process is missing start event'
        },
        {
          id: 'EVENT_SUBPROCESS',
          message: 'Sub process is missing start event'
        }
      ]
    }
  ]
});