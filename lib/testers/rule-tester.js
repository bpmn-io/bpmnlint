/* global it, describe, beforeEach */

const assert = require('assert');

const Linter = require('../linter');

function createResolver(rule) {
  return {
    resolveRule: () => Promise.resolve(rule)
  };
}

function expectEqual(a, b) {
  assert.deepStrictEqual(a, b);
}


function verify(ruleName, rule, testCases) {
  const linterConfig = {
    rules: { [ruleName]: 2 }
  };

  describe(`rules/${ruleName}`, function() {

    let linter;

    beforeEach(function() {
      linter = new Linter({
        resolver: createResolver(rule)
      });
    });


    describe('should lint valid', function() {

      testCases.valid.forEach(({ moddleElement }, idx) => (

        it(`test case #${idx + 1}`, function() {
          return (
            Promise.resolve(moddleElement)
              .then(moddleRoot => {
                return linter.lint(moddleRoot.root, linterConfig);
              })
              .then(lintResults => {
                expectEqual(lintResults.errors, []);
              })
          );
        })

      ));

    });


    describe('should lint invalid', function() {

      testCases.invalid.forEach(({ moddleElement, report }, idx) => (

        it(`test case #${idx}`, function() {
          return (
            Promise.resolve(moddleElement)
              .then(moddleRoot => {
                return linter.lint(moddleRoot.root, linterConfig);
              })
              .then(lintResults => {
                expectEqual(lintResults.errors, [report]);
              })
          );
        })

      ));

    });

  });

}


module.exports = {
  verify
};