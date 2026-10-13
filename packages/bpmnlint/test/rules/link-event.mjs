import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/link-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


RuleTester.verify('link-event', rule, {
  valid: [
    {
      moddleElement: readModdle(__dirname + '/link-event/valid.bpmn')
    },
    {
      moddleElement: readModdle(__dirname + '/link-event/valid-collaboration.bpmn')
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(__dirname + '/link-event/invalid.bpmn'),
      report: [
        {
          'id': 'CATCH_NO_NAME',
          'message': 'Link event is missing link name'
        },
        {
          'id': 'THROW_NO_NAME',
          'message': 'Link event is missing link name'
        },
        {
          'id': 'NO_CATCH',
          'message': 'Link catch event with link name <NO_CATCH> missing in scope'
        },
        {
          'id': 'NO_THROW',
          'message': 'Link throw event with link name <NO_THROW> missing in scope'
        },
        {
          'id': 'SCOPE_BOUNDARY_THROW',
          'message': 'Link catch event with link name <SCOPE_BOUNDARY> missing in scope'
        },
        {
          'id': 'DUPLICATE_NAME_CATCH_1',
          'message': 'Duplicate link catch event with link name <DUPLICATE_LINK_NAME> in scope'
        },
        {
          'id': 'DUPLICATE_NAME_CATCH_2',
          'message': 'Duplicate link catch event with link name <DUPLICATE_LINK_NAME> in scope'
        },
        {
          'id': 'SCOPE_BOUNDARY_CATCH',
          'message': 'Link throw event with link name <SCOPE_BOUNDARY> missing in scope'
        }
      ]
    }
  ]
});