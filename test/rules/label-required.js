import RuleTester from './rule-tester';

import rule from '../../rules/label-required';

RuleTester.verify('label-required', rule, {
  valid: [
    { content: 'xml...' },
    { content: 'xml...' }
  ],
  invalid: [
    {
      content: '...',
      report: {
        id: 'foo',
        message: 'bar'
      }
    },
    {
      content: '...',
      report: {
        id: 'foo',
        message: 'bar'
      }
    },
  ]
});