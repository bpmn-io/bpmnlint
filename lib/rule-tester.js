/* global it, describe, beforeEach */

const Linter = require('./linter');

function createRuleResolver(rule) {
  return {
    resolve: () => Promise.resolve(rule)
  };
}

module.exports = function RuleTesterFactory(options = {}) {

  const {
    expectEqual
  } = options;

  if (!expectEqual) {
    throw new Error('missing <options.expectEqual>');
  }

  return {
    verify(ruleName, rule, testCases) {
      const linterConfig = {
        rules: { [ruleName]: 2 }
      };

      describe(`rules/${ruleName}`, function() {
        let linter;

        beforeEach(function() {
          linter = new Linter({
            ruleResolver: createRuleResolver(rule)
          });
        });

        describe('#should lint valid', function() {
          testCases.valid.forEach(({ moddleElement }, idx) => (
            it(`test case #${idx + 1}`, function() {
              return moddleElement
                .then(moddleRoot => {
                  return linter.lint(moddleRoot.root, linterConfig);
                })
                .then(lintResults => {
                  expectEqual(lintResults.errors, []);
                });
            })
          ));
        });

        describe('#should lint invalid', function() {
          testCases.invalid.forEach(({ moddleElement, report }, idx) => (
            it(`test case #${idx}`, function() {
              return moddleElement
                .then(moddleRoot => {
                  return linter.lint(moddleRoot.root, linterConfig);
                })
                .then(lintResults => {
                  expectEqual(lintResults.errors, [report]);
                });
            })
          ));
        });

      });
    }
  };
};