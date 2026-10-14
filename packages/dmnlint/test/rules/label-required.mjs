import path from 'node:path';
import { fileURLToPath } from 'node:url';

import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/label-required.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const message = 'Element is missing label/name';


RuleTester.verify('label-required', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/label-required/valid-complex.dmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-business-knowledge-model.dmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-decision.dmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-input-data.dmn'),
      report: {
        id: 'Element',
        message
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid-knowledge-source.dmn'),
      report: {
        id: 'Element',
        message
      }
    }
  ]
});