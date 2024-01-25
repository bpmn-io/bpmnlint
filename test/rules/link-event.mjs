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
          'id': 'THROW_NO_NAME',
          'message': 'Link event is missing name',
          'category': 'error'
        },
        {
          'id': 'CATCH_NO_NAME',
          'message': 'Link event is missing name',
          'category': 'error'
        },
        {
          'id': 'NO_CATCH',
          'message': 'Link catch event with name <NO_CATCH> missing in scope',
          'category': 'error'
        },
        {
          'id': 'NO_THROW',
          'message': 'Link throw event with name <NO_THROW> missing in scope',
          'category': 'error'
        },
        {
          'id': 'SCOPE_BOUNDARY_THROW',
          'message': 'Link catch event with name <SCOPE_BOUNDARY> missing in scope',
          'category': 'error'
        },
        {
          'id': 'DUPLICATE_NAME_THROW_1',
          'message': 'Duplicate link throw event with name <DUPLICATE_NAME> in scope',
          'category': 'error'
        },
        {
          'id': 'DUPLICATE_NAME_THROW_2',
          'message': 'Duplicate link throw event with name <DUPLICATE_NAME> in scope',
          'category': 'error'
        },
        {
          'id': 'DUPLICATE_NAME_CATCH_1',
          'message': 'Duplicate link catch event with name <DUPLICATE_NAME> in scope',
          'category': 'error'
        },
        {
          'id': 'DUPLICATE_NAME_CATCH_2',
          'message': 'Duplicate link catch event with name <DUPLICATE_NAME> in scope',
          'category': 'error'
        },
        {
          'id': 'SCOPE_BOUNDARY_CATCH',
          'message': 'Link throw event with name <SCOPE_BOUNDARY> missing in scope',
          'category': 'error'
        }
      ]
    }
  ]
});