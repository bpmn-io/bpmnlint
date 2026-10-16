const { createRuleTester } = require('@bpmn-io/lint-core/lib/testers/rule-tester');

const {
  expectEqual,
  verify,
  getTitle,
  replacer
} = createRuleTester({
  Linter: require('../linter')
});

module.exports = {
  expectEqual,
  verify,
  getTitle,
  replacer
};
