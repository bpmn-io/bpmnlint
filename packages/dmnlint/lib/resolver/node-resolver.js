const { createNodeResolver } = require('@bpmn-io/lint-core/lib/resolver/node-resolver');

// rules and configs of this package are resolved relative to this file,
// i.e. via ../../rules/* and ../../config/*
module.exports = createNodeResolver(require('../product'), {
  requireLocal: require
});
