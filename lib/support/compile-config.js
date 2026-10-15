const { createCompileConfig } = require('@bpmn-io/lint-core/lib/support/compile-config');

module.exports = createCompileConfig({
  Linter: require('../linter'),
  NodeResolver: require('../resolver/node-resolver')
});
