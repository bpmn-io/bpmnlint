import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-disconnected.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-disconnected', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-text-annotation.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-event-subprocess.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-adhoc-subprocess.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-compensation.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/invalid.bpmn'),
      report: {
        id: 'Element',
        message: 'Element is not connected'
      }
    }
  ]
});
