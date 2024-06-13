export type TestFn = (...any) => any;

export type ModdleElement = any;

export type ValidRuleTest = {
  config?: any,
  it?: TestFn,
  moddleElement: ModdleElement,
  name?: string
};

export type InvalidReport = {
  id: string,
  message: string
};

export type InvalidRuleTest = {
  config?: any,
  it?: TestFn,
  moddleElement: ModdleElement,
  name?: string,
  report: InvalidReport | InvalidReport[]
};

export type RuleTests = {
  valid?: ValidRuleTest[],
  invalid?: InvalidRuleTest[]
};

/**
 * Verify a rule.
 *
 * @param ruleName
 * @param rule the rule implementation
 * @param tests the tests to verify
 */
export function verify(ruleName: string, rule: any, tests: RuleTests): void;