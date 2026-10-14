import type { RuleTests } from '@bpmn-io/lint-core/lib/testers/rule-tester';

export type {
  TestFn,
  ModdleElement,
  ValidRuleTest,
  InvalidReport,
  InvalidRuleTest,
  RuleTests
} from '@bpmn-io/lint-core/lib/testers/rule-tester';

/**
 * Verify a rule.
 *
 * @param ruleName
 * @param rule the rule implementation
 * @param tests the tests to verify
 */
export function verify(ruleName: string, rule: any, tests: RuleTests): void;
