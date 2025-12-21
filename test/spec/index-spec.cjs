const { expect } = require('chai');

const {
  Linter
} = require('bpmnlint');


describe('index', function() {

  it('should CJS export { Linter }', function() {
    expect(Linter).to.exist;
  });


  it('should ES export { Linter }', async function() {

    // when
    const { Linter } = await import('bpmnlint');

    // then
    expect(Linter).to.exist;
  });

});