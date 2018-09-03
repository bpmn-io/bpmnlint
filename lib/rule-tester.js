/* global it, describe */

module.exports = function RuleTesterFactory(options = {}) {

  const {
    expectEqual
  } = options;

  if (!expectEqual) {
    throw new Error('missing <options.expectEqual>');
  }

  return {
    verify(ruleName, rule, testCases) {

      describe(`rules/${ruleName}`, function() {

        it('should lint valid', function() {
        });

        it('should lint invalid', function() {
        });

      });
    }
  };
};