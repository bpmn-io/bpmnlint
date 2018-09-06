import {
  expect
} from '../helper';

import { Linter as ESLinter } from '../..';

const {
  Linter
} = require('../..');


describe('index', function() {

  it('should CJS export { Linter }', function() {
    expect(Linter).to.exist;
  });


  it('should ES export { Linter }', function() {
    expect(ESLinter).to.exist;
  });

});