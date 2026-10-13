import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/global.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('global', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/global/valid-error.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/global/valid-escalation.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/global/valid-message.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/global/valid-no-ref.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/global/invalid-error-missing-name.bpmn'),
      report: {
        id: 'Error',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-escalation-missing-name.bpmn'),
      report: {
        id: 'Escalation',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-message-missing-name.bpmn'),
      report: {
        id: 'Message',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-signal-missing-name.bpmn'),
      report: {
        id: 'Signal',
        message: 'Element is missing name'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-error-missing-reference.bpmn'),
      report: {
        id: 'Error',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-escalation-missing-reference.bpmn'),
      report: {
        id: 'Escalation',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-message-missing-reference.bpmn'),
      report: {
        id: 'Message',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-signal-missing-reference.bpmn'),
      report: {
        id: 'Signal',
        message: 'Element is unused'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-error-duplicate-name.bpmn'),
      report: [ {
        id: 'Error_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Error_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-escalation-duplicate-name.bpmn'),
      report: [ {
        id: 'Escalation_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Escalation_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-message-duplicate-name.bpmn'),
      report: [ {
        id: 'Message_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Message_2',
        message: 'Element name is not unique'
      } ]
    },
    {
      moddleElement: readModdle(__dirname + '/global/invalid-signal-duplicate-name.bpmn'),
      report: [ {
        id: 'Signal_1',
        message: 'Element name is not unique'
      },
      {
        id: 'Signal_2',
        message: 'Element name is not unique'
      } ]
    }
  ]
});