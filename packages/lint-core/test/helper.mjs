import { BpmnModdle } from 'bpmn-moddle';

import { createModdleHelper } from '../lib/testers/helper.js';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export { expect } from 'chai';

export const {
  createModdle,
  readModdle
} = createModdleHelper({
  Moddle: BpmnModdle,
  rootType: 'bpmn:Definitions'
});

// minimal utilities for the rules that are used to test the linter,
// cf. <bpmnlint-utils> for the real thing
export const utils = {
  is: (node, type) => node.$instanceOf('bpmn:' + type)
};

export function createRule(ruleFactory) {
  return ruleFactory(utils);
}

export function stubCJS(path) {

  return {
    __dirname: dirname(fileURLToPath(path)),
    require: createRequire(path)
  };
}
