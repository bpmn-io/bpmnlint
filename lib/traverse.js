/**
 * Traverse a moddle tree, depth first from top to bottom
 * and call the passed visitor fn.
 *
 * @param {ModdleElement} element
 * @param {Function} fn
 */
module.exports = function traverse(element, fn) {
  fn(element);

  var containedProperties = element.$descriptor.properties.filter(p => {
    return !p.isAttr && !p.isReference;
  });

  containedProperties.forEach(p => {
    if (p.name in element) {
      const propertyValue = element[p.name];

      if (p.isMany) {
        propertyValue.forEach(child => {
          traverse(child, fn);
        });
      } else {
        traverse(propertyValue, fn);
      }
    }
  });
};
