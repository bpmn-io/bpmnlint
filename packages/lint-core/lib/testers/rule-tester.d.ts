export type TestFn = (...args: any[]) => any;

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
 * Create a rule tester that lints with the `Linter` of a product.
 */
export function createRuleTester(product: { Linter: any }): {

  /**
   * Verify a rule.
   *
   * @param ruleName
   * @param rule the rule implementation
   * @param tests the tests to verify
   */
  verify: (ruleName: string, rule: any, tests: RuleTests) => void,

  expectEqual: (a: any, b: any) => void,

  getTitle: (idx: number, name?: string) => string,

  replacer: (key: string, value: any) => any
};
