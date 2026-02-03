import * as utils from 'bpmnlint-utils';

export * from '../lib/testers/helper.js';

export { expect } from 'chai';

export function createRule(ruleFactory) {
  return ruleFactory(utils);
}