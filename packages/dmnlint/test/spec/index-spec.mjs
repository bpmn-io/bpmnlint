import {
  expect
} from '../helper.mjs';

import { createRequire } from 'node:module';

import { Linter as ESLinter } from 'dmnlint';

const require = createRequire(import.meta.url);

const {
  Linter
} = require('dmnlint');


describe('index', function() {

  it('should CJS export { Linter }', function() {
    expect(Linter).to.exist;
  });


  it('should ES export { Linter }', function() {
    expect(ESLinter).to.exist;
  });

});
