import RuleTester from '../../lib/testers/rule-tester.js';

import rule from '../../rules/link-event.js';

import {
  readModdle
} from '../../lib/testers/helper.js';


RuleTester.verify('link-event', rule, {
  valid: [
    {
      moddleElement: readModdle(new URL('./link-event/valid.bpmn', import.meta.url))
    },
    {
      moddleElement: readModdle(new URL('./link-event/valid-collaboration.bpmn', import.meta.url))
    }
  ],
  invalid: [
    {
      moddleElement: readModdle(new URL('./link-event/invalid.bpmn', import.meta.url)),
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