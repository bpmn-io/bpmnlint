import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-label.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


import {
  readModdle
} from '../../lib/testers/helper.js';


const message = 'Sequence flow has superfluous label';


RuleTester.verify('superfluous-label', rule, {
  valid: [
    {
      name: 'unlabeled flow, labeled XOR/OR fork, conditional and default flows',
      moddleElement: readModdle(__dirname + '/superfluous-label/valid.bpmn')
    }
  ],
  invalid: [
    {
      name: 'labeled unconditional flows',
      moddleElement: readModdle(__dirname + '/superfluous-label/invalid.bpmn'),
      report: [
        {
          id: 'Flow_Labeled_StartEvent',
          message,
          path: [ 'name' ]
        },
        {
          id: 'Flow_Labeled_Task',
          message,
          path: [ 'name' ]
        },
        {
          id: 'Flow_Labeled_Gateway',
          message,
          path: [ 'name' ]
        },
        {
          id: 'Flow_Labeled_Passthrough',
          message,
          path: [ 'name' ]
        }
      ]
    }
  ]
});
