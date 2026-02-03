import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/ad-hoc-sub-process.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('ad-hoc-sub-process', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./ad-hoc-sub-process/valid.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./ad-hoc-sub-process/invalid-start-end.bpmn', import.meta.url)),
      report: [
        {
          id: 'StartEvent',
          message: 'A <Start Event> is not allowed in <Ad Hoc Sub Process>'
        },
        {
          id: 'EndEvent',
          message: 'An <End Event> is not allowed in <Ad Hoc Sub Process>'
        }
      ]
    }
  ]
});
