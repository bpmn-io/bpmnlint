import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/conditional-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('conditional-event', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./conditional-event/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./conditional-event/not-executable.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./conditional-event/missing-condition.bpmn', import.meta.url)),
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
