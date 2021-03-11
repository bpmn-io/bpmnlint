import RuleTester from '../../lib/testers/rule-tester';

import rule from '../../rules/no-disconnected';

import {
  readModdle
} from '../../lib/testers/helper';


RuleTester.verify('no-disconnected', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-text-annotation.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-event-subprocess.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/valid-compensation.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/no-disconnected/invalid.bpmn'),
      report: {
        id: 'Element',
        message: 'Element is not connected'
      }
    }
  ]
});
