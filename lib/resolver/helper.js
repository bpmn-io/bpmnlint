const Module = require('node:module');
const path = require('node:path');

/**
 * Create require function for a given path.
 *
 * @param {string} cwd
 * @returns {NodeRequire}
 */
module.exports.createScopedRequire = function(cwd) {
  return Module.createRequire(path.join(cwd, '__placeholder__.js'));
};
