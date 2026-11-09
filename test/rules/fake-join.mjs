import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/fake-join.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('fake-join', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/fake-join/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/valid-gateway.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/valid-link-event.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/fake-join/invalid-task.bpmn'),
      report: {
        id: 'Element',
        message: 'Incoming flows do not join'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/invalid-callActivity.bpmn'),
      report: {
        id: 'Element',
        message: 'Incoming flows do not join'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/invalid-link-event.bpmn'),
      report: {
        id: 'Catch',
        message: 'Link throw events with link name <L> do not join'
      }
    },
    {
      moddleElement: readModdle(__dirname + '/fake-join/invalid-link-event-subprocess.bpmn'),
      report: {
        id: 'Catch',
        message: 'Link throw events with link name <L> do not join'
      }
    }
  ]
});