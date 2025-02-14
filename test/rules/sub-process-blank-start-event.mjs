import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/sub-process-blank-start-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('sub-process-blank-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-empty.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-intermediate-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/valid-event-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/invalid.bpmn'),
      report: {
        id: 'StartEvent',
        message: 'Start event must be blank',
        path: [ 'eventDefinitions' ]
      }
    },
    {
      moddleElement: readModdle(__dirname + '/sub-process-blank-start-event/invalid-ad-hoc.bpmn'),
      report: {
        id: 'StartEvent',
        message: 'Start event must be blank',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});