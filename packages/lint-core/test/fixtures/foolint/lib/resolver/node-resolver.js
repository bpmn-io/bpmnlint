const { createNodeResolver } = require('../../../../../lib/resolver/node-resolver');

module.exports = createNodeResolver(require('../product'), {
  requireLocal: require
});
