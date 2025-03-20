const { expect } = require('chai');

const {
  Linter
} = require('../../lib/index');


describe('index', function() {

  it('should CJS export { Linter }', function() {
    expect(Linter).to.exist;
  });


  it('should ES export { Linter }', async function() {

    // when
    const { Linter } = await import('../../lib/index.js');

    // then
    expect(Linter).to.exist;
  });

});