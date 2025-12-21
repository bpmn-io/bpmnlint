import { verify } from '../../lib/testers/rule-tester.js';

import rule from '../../rules/ad-hoc-sub-process.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.js';

const {
  __dirname
} = stubCJS(import.meta.url);


verify('ad-hoc-sub-process', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/ad-hoc-sub-process/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/ad-hoc-sub-process/invalid-start-end.bpmn'),
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
