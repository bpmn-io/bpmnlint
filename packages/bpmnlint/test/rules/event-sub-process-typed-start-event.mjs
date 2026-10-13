import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/event-sub-process-typed-start-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('event-sub-process-typed-start-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-empty.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-empty-sub-process.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-intermediate-event.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/valid-sub-process.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/event-sub-process-typed-start-event/invalid.bpmn'),
      report: {
        id: 'StartEvent',
        message: 'Start event is missing event definition',
        path: [ 'eventDefinitions' ]
      }
    }
  ]
});