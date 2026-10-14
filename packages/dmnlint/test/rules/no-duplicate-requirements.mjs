import path from 'node:path';
import { fileURLToPath } from 'node:url';

import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-duplicate-requirements.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const incomingMessage = 'Duplicate incoming requirements';
const outgoingMessage = 'Duplicate outgoing requirements';


RuleTester.verify('no-duplicate-requirements', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-requirements/valid-complex.dmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-requirements/invalid-authority-requirement.dmn'),
      report: [
        {
          id: 'Decision',
          'message': outgoingMessage
        },
        {
          id: 'KnowledgeSource',
          message: incomingMessage
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-requirements/invalid-information-requirement.dmn'),
      report: [
        {
          id: 'Decision',
          'message': outgoingMessage
        },
        {
          id: 'InputData',
          message: incomingMessage
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-requirements/invalid-knowledge-requirement.dmn'),
      report: [
        {
          id: 'Decision',
          'message': outgoingMessage
        },
        {
          id: 'BusinessKnowledgeModel',
          message: incomingMessage
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/no-duplicate-requirements/invalid-complex.dmn'),
      report: [
        {
          id: 'Decision_1',
          'message': outgoingMessage
        },
        {
          id: 'BusinessKnowledgeModel_1',
          message: incomingMessage
        },
        {
          id: 'Decision_2',
          message: outgoingMessage
        },
        {
          id: 'Decision_1',
          message: incomingMessage
        },
        {
          id: 'InputData_2',
          message: incomingMessage
        },
        {
          id: 'KnowledgeSource_1',
          message: outgoingMessage
        },
        {
          id: 'KnowledgeSource_2',
          message: incomingMessage
        },
        {
          id: 'BusinessKnowledgeModel_2',
          message: outgoingMessage
        },
        {
          id: 'KnowledgeSource_1',
          message: incomingMessage
        },
        {
          id: 'KnowledgeSource_2',
          message: outgoingMessage
        },
        {
          id: 'InputData_1',
          message: incomingMessage
        },
        {
          id: 'BusinessKnowledgeModel_1',
          message: outgoingMessage
        },
        {
          id: 'BusinessKnowledgeModel_2',
          message: incomingMessage
        }
      ]
    }
  ]
});