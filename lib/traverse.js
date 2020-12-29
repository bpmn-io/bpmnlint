/**
 * Traverse a moddle tree, depth first from top to bottom
 * and call the passed visitor fn.
 *
 * @param {ModdleElement} element
 * @param {{ enter?: Function; leave?: Function }} options
 */
module.exports = function traverse(element, options) {

  var enter = options.enter || null;
  var leave = options.leave || null;

  var enterSubTree = enter && enter(element);

  var descriptor = element.$descriptor;

  var containedProperties;

  if (enterSubTree !== false && !descriptor.isGeneric) {

    containedProperties = descriptor.properties.filter(p => {
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
