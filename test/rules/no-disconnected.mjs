import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-disconnected.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('no-disconnected', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./no-disconnected/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-disconnected/valid-text-annotation.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-disconnected/valid-event-subprocess.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-disconnected/valid-adhoc-subprocess.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./no-disconnected/valid-compensation.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./no-disconnected/invalid.bpmn', import.meta.url)),
      report: {
        id: 'Element',
        message: 'Element is not connected'
      }
    }
  ]
});
