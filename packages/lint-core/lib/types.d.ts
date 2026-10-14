export type ModdleElement = any;

export interface Reporter {

  report(id: string, message: string): void;

  report(id: string, message: string, path: string[]): void;

  report(id: string, message: string, context: {
    path?: string[],
    [key: string]: any
  }) : void;
}

export interface Resolver {

  resolveRule(pkg: string, ruleName: string): Promise<RuleFactory> | RuleFactory,

  resolveConfig(pkg: string, configName: string): Promise<Config> | Config;
}

export type EnterFn = (element: ModdleElement, reporter: Reporter) => boolean | void;

export type LeaveFn = (element: ModdleElement, reporter: Reporter) => void;

export type CheckDefinition = EnterFn | {
  enter: EnterFn
} | {
  leave: LeaveFn
} | {
  enter: EnterFn,
  leave: LeaveFn
};

export type RuleDefinition = {
  meta?: {
    documentation?: {
      url?: string
    }
  },
  check: CheckDefinition
};

export type RuleFactory = (ruleOptions?: any) => RuleDefinition;

export type ReportingCategoryMap = {
  0: 'off',
  1: 'warn',
  2: 'error',
  3: 'info'
};

export type ReportingCategoryIndex = keyof ReportingCategoryMap;
export type ReportingCategory = ReportingCategoryMap[ReportingCategoryIndex];

export type RuleErrorCategory = 'rule-error';

export type RuleConfig =
  ReportingCategoryIndex |
  ReportingCategory |
  [ ReportingCategoryIndex, config?: any ] |
  [ ReportingCategory, config?: any ];

export type RuleConfigs = Record<string, RuleConfig>;

export type Config = {
  extends?: string | string[],
  rules?: RuleConfigs
};

export type TransformRuleFn = (
  rule: RuleDefinition,
  options: { pkg: string, ruleName: string }
) => RuleDefinition;

export type Report = {
  id?: string,
  path?: string[],
  message: string,
  [key: string]: any
};