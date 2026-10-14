const { createLinter } = require('./linter');
const StaticResolver = require('./resolver/static-resolver');
const traverse = require('./traverse');
const testRule = require('./test-rule');

module.exports = {
  createLinter,
  StaticResolver,
  traverse,
  testRule
};
