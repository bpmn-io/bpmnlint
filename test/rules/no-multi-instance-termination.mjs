import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/no-multi-instance-termination.js';

import {
  createModdle,
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);

const examples = __dirname + '/../../docs/rules/examples';
const fixtures = __dirname + '/no-multi-instance-termination';
const message = 'Termination affects only this multi-instance iteration; other iterations are not canceled.';

function report(id) {
  return { id, message };
}

RuleTester.verify('no-multi-instance-termination', rule, {
  valid: [
    {
      name: 'interrupting escalation boundary event',
      moddleElement: readModdle(examples + '/no-multi-instance-termination-correct.bpmn')
    },
    {
      name: 'interrupting event subprocess in the multi-instance subprocess',
      moddleElement: readModdle(examples + '/no-multi-instance-termination-event-subprocess-correct.bpmn')
    },
    {
      name: 'nested subprocess and event subprocess have their own scope',
      moddleElement: readModdle(fixtures + '/valid-nested.bpmn')
    },
    {
      name: 'process, ordinary subprocess, and standard loop',
      moddleElement: readModdle(fixtures + '/valid-non-multi-instance.bpmn')
    },
    {
      name: 'non-terminate end events in a multi-instance subprocess',
      moddleElement: readModdle(fixtures + '/valid-other-end-events.bpmn')
    },
    {
      name: 'standalone terminate event without a parent',
      moddleElement: createModdle(
        '<bpmn:endEvent xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Standalone">' +
          '<bpmn:terminateEventDefinition />' +
        '</bpmn:endEvent>',
        'bpmn:EndEvent'
      )
    }
  ],
  invalid: [
    {
      name: 'sequential multi-instance subprocess',
      moddleElement: readModdle(fixtures + '/sequential.bpmn'),
      report: report('SequentialTerminate')
    },
    {
      name: 'parallel work interrupted inside a multi-instance subprocess',
      moddleElement: readModdle(examples + '/no-multi-instance-termination-incorrect.bpmn'),
      report: report('Event_3')
    },
    {
      name: 'explicit and default parallel multi-instance subprocesses',
      moddleElement: readModdle(fixtures + '/parallel.bpmn'),
      report: [
        report('ExplicitParallelTerminate'),
        report('DefaultParallelTerminate')
      ]
    },
    {
      name: 'nested multi-instance scopes',
      moddleElement: readModdle(fixtures + '/nested-multi-instance.bpmn'),
      report: [
        report('OuterTerminate'),
        report('NestedMultiTerminate'),
        report('DoubleMultiTerminate')
      ]
    },
    {
      name: 'referenced and inline terminate definitions',
      moddleElement: readModdle(fixtures + '/referenced-termination.bpmn'),
      report: [
        report('ReferencedTerminate'),
        report('InlineAndReferencedTerminate')
      ]
    },
    {
      name: 'multi-instance transaction subprocess',
      moddleElement: readModdle(fixtures + '/transaction.bpmn'),
      report: report('TransactionTerminate')
    }
  ]
});

