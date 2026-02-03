import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/superfluous-termination.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('superfluous-termination', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./superfluous-termination/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./superfluous-termination/valid-implicit-end.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./superfluous-termination/valid-boundary-non-interrupting.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./superfluous-termination/valid-event-sub-process-non-interrupting.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./superfluous-termination/invalid.bpmn', import.meta.url)),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      it: it.skip,
      moddleElement: readModdle(new URL('./superfluous-termination/invalid-boundary-interrupting.bpmn', import.meta.url)),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      moddleElement: readModdle(new URL('./superfluous-termination/invalid-event-sub-process-interrupting.bpmn', import.meta.url)),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      it: it.skip,
      moddleElement: readModdle(new URL('./superfluous-termination/invalid-exclusive-paths.bpmn', import.meta.url)),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    },
    {
      moddleElement: readModdle(new URL('./superfluous-termination/invalid-sub-process.bpmn', import.meta.url)),
      report: {
        id: 'TERMINATE_EVENT',
        message: 'Termination is superfluous.'
      }
    }
  ]
});