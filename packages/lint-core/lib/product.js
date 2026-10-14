/**
 * @typedef { import('./types.js').Product } Product
 */

/**
 * Validate the given product and fill in defaults.
 *
 * @param { Product } product
 *
 * @return { Required<Product> }
 */
function normalizeProduct(product) {

  const {
    name,
    pluginPrefix = name + '-plugin-'
  } = product || {};

  if (typeof name !== 'string' || !name) {
    throw new Error('must provide <product.name>');
  }

  return {
    name,
    pluginPrefix
  };
}

/**
 * Escape a string, so it can be used verbatim in a regular expression.
 *
 * @param { string } string
 *
 * @return { string }
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  normalizeProduct,
  escapeRegExp
};
