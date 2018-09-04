import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/label-required';

import {
  createModdle,
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('label-required', rule, {
  valid: [
    {
      moddleElement: createModdle(
        '<startEvent xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="StartEvent_1" name="hunger noticed" />',
        'bpmn:StartEvent'
      )
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/valid.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: createModdle(
        '<startEvent xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" id="StartEvent_1" />',
        'bpmn:StartEvent'
      ),
      report: {
        id: 'StartEvent_1',
        message: 'Element is missing a label/name.'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/label-required/invalid.bpmn'),
      report: {
        id: 'ExclusiveGateway_1opgqct',
        message: 'Element is missing a label/name.'
      }
    }
  ]
});