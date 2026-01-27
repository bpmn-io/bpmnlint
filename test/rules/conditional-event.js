import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/conditional-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('conditional-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/conditional-event/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/conditional-event/missing-condition.bpmn'),
      report: [
        {
          id: 'Event_1',
          message: 'Conditional event is missing a condition',
          path: [
            'condition'
          ],
        }
      ]
    }
  ]
});
