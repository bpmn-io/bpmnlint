import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-label.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


const message = 'Element has superfluous label/name';


RuleTester.verify('superfluous-label', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/superfluous-label/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-gateway-join-fork/invalid.bpmn'),
      report: [
        {
          id: 'GATEWAY',
          message,
          path: [
            'name'
          ],
          category: 'error'
        },
        {
          id: 'DEFAULT_FLOW',
          message,
          path: [
            'name'
          ],
          category: 'error'
        },
        {
          id: 'SIMPLE_FLOW',
          message,
          path: [
            'name'
          ],
          category: 'error'
        }
      ]
    }
  ]
});