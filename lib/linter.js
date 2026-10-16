const { createLinter } = require('@bpmn-io/lint-core/lib/linter');

module.exports = createLinter(require('./product'));
