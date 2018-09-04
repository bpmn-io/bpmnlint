import utils from '../lib/utils';

export * from '../lib/testers/helper';

export { expect } from 'chai';

export function createRule(ruleFactory) {
  return ruleFactory(utils);
}
