/**
 * Traverse a moddle tree, depth first from top to bottom
 * and call the passed visitor fn.
 *
 * @param {ModdleElement} element
 * @param {{ enter?: Function; leave?: Function }} options
 */
module.exports = function traverse(element, options) {

  const enter = options.enter || null;
  const leave = options.leave || null;

  const enterSubTree = enter && enter(element);

  const descriptor = element.$descriptor;

  if (enterSubTree !== false && !descriptor.isGeneric) {

    const containedProperties = descriptor.properties.filter(p => {
      return !p.isAttr && !p.isReference && p.type !== 'String';
    });

    containedProperties.forEach(p => {
      if (p.name in element) {
        const propertyValue = element[p.name];

        if (p.isMany) {
          propertyValue.forEach(child => {
            traverse(child, options);
          });
        } else {
          traverse(propertyValue, options);
        }
      }
    });
  }

  leave && leave(element);
};
