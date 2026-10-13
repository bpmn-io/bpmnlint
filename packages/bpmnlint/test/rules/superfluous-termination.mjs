import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-termination.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('superfluous-termination', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/valid-implicit-end.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/valid-boundary-non-interrupting.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/valid-event-sub-process-non-interrupting.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/invalid.bpmn'),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      it: it.skip,
      moddleElement: readModdle(__dirname + '/superfluous-termination/invalid-boundary-interrupting.bpmn'),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/invalid-event-sub-process-interrupting.bpmn'),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      it: it.skip,
      moddleElement: readModdle(__dirname + '/superfluous-termination/invalid-exclusive-paths.bpmn'),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/superfluous-termination/invalid-sub-process.bpmn'),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    }
  ]
});