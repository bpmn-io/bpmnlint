import * as utils from 'dmnlint-utils';

export * from 'dmnlint/lib/testers/helper.js';

export { expect } from 'chai';

export function createRule(ruleFactory) {
  return ruleFactory(utils);
}


import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export function stubCJS(path) {

  return {
    __dirname: dirname(fileURLToPath(path)),
    require: createRequire(path)
  };
}
