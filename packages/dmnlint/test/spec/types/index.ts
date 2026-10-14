import type { InvalidReport, RuleTests } from 'dmnlint/lib/testers/rule-tester';

import type { Config, RuleDefinition } from 'dmnlint/lib/types';

import { verify } from 'dmnlint/lib/testers/rule-tester';

const rule: RuleDefinition = {
  check() {}
};

const config: Config = {
  extends: 'dmnlint:recommended',
  rules: {
    'foo': 'error'
  }
};

const report: InvalidReport = {
  id: 'foo',
  message: 'Foo'
};

const tests: RuleTests = {
  invalid: [
    {
      moddleElement: {},
      report
    }
  ]
};

verify('foo', {}, tests);


export { rule, config };
