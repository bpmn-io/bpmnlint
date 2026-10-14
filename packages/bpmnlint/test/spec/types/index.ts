import type { InvalidReport, RuleTests } from 'bpmnlint/lib/testers/rule-tester';

import type { Config, RuleDefinition } from 'bpmnlint/lib/types';

import { verify } from 'bpmnlint/lib/testers/rule-tester';

const rule: RuleDefinition = {
  check() {}
};

const config: Config = {
  extends: 'bpmnlint:recommended',
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
