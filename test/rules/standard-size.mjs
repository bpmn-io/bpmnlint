import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/standard-size.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('standard-size', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-elements.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-expanded-subprocess.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-collaboration.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-empty-pool-horizontal.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-empty-pool-vertical.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/valid-missing-di.bpmn')
    },
    {
      name: 'configured size',
      config: { 'bpmn:Task': { width: 120, height: 80 } },
      moddleElement: readModdle(__dirname + '/standard-size/valid-config.bpmn')
    },
    {
      name: 'ignore malformed config',
      config: { 'bpmn:Task': null },
      moddleElement: readModdle(__dirname + '/standard-size/valid-elements.bpmn')
    },
    {
      name: 'ignore malformed empty pool config',
      config: { 'bpmn:Participant': null },
      moddleElement: readModdle(__dirname + '/standard-size/valid-empty-pool-horizontal.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/standard-size/invalid-elements.bpmn'),
      report: [
        {
          id: 'Task_1',
          message: 'Element has a non-standard size; expected 100x80'
        },
        {
          id: 'StartEvent_1',
          message: 'Element has a non-standard size; expected 36x36'
        },
        {
          id: 'Gateway_1',
          message: 'Element has a non-standard size; expected 50x50'
        }
      ]
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/invalid-collapsed-subprocess.bpmn'),
      report: {
        id: 'SubProcess_1',
        message: 'Element has a non-standard size; expected 100x80'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/invalid-empty-pool-horizontal.bpmn'),
      report: {
        id: 'Participant_1',
        message: 'Element has a non-standard height; expected height of 60'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/standard-size/invalid-empty-pool-vertical.bpmn'),
      report: {
        id: 'Participant_1',
        message: 'Element has a non-standard width; expected width of 60'
      }
    },
    {
      name: 'configured size',
      config: { 'bpmn:Task': { width: 120, height: 80 } },
      moddleElement: readModdle(__dirname + '/standard-size/valid-elements.bpmn'),
      report: {
        id: 'Task_1',
        message: 'Element has a non-standard size; expected 120x80'
      }
    },
    {
      name: 'configured empty pool size',
      config: { 'bpmn:Participant': { width: 80, height: 60 } },
      moddleElement: readModdle(__dirname + '/standard-size/valid-empty-pool-vertical.bpmn'),
      report: {
        id: 'Participant_00h09d6',
        message: 'Element has a non-standard width; expected width of 80'
      }
    }
  ]
});
