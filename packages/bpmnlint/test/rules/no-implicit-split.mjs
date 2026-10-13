import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-implicit-split.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('no-implicit-split', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/valid-default-conditional-flow.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/invalid-event.bpmn'),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/invalid-task.bpmn'),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/no-implicit-split/invalid-call-activity.bpmn'),
      report: {
        id: 'Element',
        message: 'Flow splits implicitly'
      }
    }
  ]
});