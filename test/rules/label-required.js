import RuleTester from './rule-tester';

import rule from '../../rules/label-required';

import {
  createModdle,
  readModdle
} from '../helper';


RuleTester.verify('label-required', rule, {
  valid: [
    {
      moddleElement: createModdle(
        '<startEvent xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="StartEvent_1" name="hunger noticed" />',
        'bpmn:StartEvent'
      )
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid.parallel-gateway.part.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: '...',
      report: {
        id: 'foo',
        message: 'bar'
      }
    },
    {
      moddleElement: '...',
      report: {
        id: 'foo',
        message: 'bar'
      }
    },
  ]
});