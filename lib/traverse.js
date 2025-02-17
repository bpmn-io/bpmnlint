/**
 * @typedef { import('./types.js').ModdleElement } ModdleElement
 *
 * @typedef { (element: ModdleElement) => boolean | void } EnterFn
 * @typedef { (element: ModdleElement) => void } LeaveFn
 */


/**
 * Traverse a moddle tree, depth first from top to bottom
 * and call the passed visitor fn.
 *
 * @param { ModdleElement } element
 * @param { { enter?: EnterFn; leave?: LeaveFn } } options
 */
module.exports = function traverse(element, options) {

  const enter = options.enter;
  const leave = options.leave;

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
