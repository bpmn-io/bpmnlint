const { readFileSync } = require('node:fs');

/**
 * @typedef { any } ModdleElement
 *
 * @typedef { {
 *   root: ModdleElement,
 *   moddle: any,
 *   warnings: any[]
 * } } CreatedModdle
 */

/**
 * Create the helpers to read moddle trees that are used when testing rules.
 *
 * @param { {
 *   Moddle: new (extensions?: any) => any,
 *   rootType: string
 * } } options the product moddle and the type of the root element, i.e. `bpmn:Definitions`
 */
function createModdleHelper({ Moddle, rootType }) {

  /**
   * Create moddle instance.
   *
   * @param {string} xml the XML string
   * @param {string | Object} [elementType]
   * @param {Object} [moddleExtensions]
   *
   * @return {Promise<CreatedModdle>}
   */
  async function createModdle(xml, elementType = rootType, moddleExtensions) {

    if (typeof elementType !== 'string') {
      moddleExtensions = elementType;
      elementType = undefined;
    }

    if (typeof elementType === 'undefined') {
      elementType = rootType;
    }

    const moddle = new Moddle(moddleExtensions);

    const {
      rootElement: root,
      warnings = []
    } = await moddle.fromXML(xml, elementType, { lax: true });

    return {
      root,
      moddle,

      // @ts-ignore-next-line "legacy"
      context: {
        warnings
      },
      warnings
    };
  }

  /**
   * Return moddle instance, read from the given file.
   *
   * @param {string|URL} filePath
   * @param {string} [elementType]
   * @param {Object} [moddleExtensions]
   *
   * @return {Promise<CreatedModdle>}
   */
  function readModdle(filePath, elementType, moddleExtensions) {
    const contents = readFileSync(filePath, 'utf8');

    return createModdle(contents, elementType, moddleExtensions);
  }

  return {
    createModdle,
    readModdle
  };
}

module.exports = {
  createModdleHelper
};
