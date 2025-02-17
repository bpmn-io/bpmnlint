// @ts-expect-error 'missing <bpmn-moddle> types'
const BpmnModdle = require('bpmn-moddle');

const { readFileSync } = require('node:fs');


/**
 * Create moddle instance.
 *
 * @param {String} xml the XML string
 *
 * @return {Promise<Object>}
 */
async function createModdle(xml, elementType = 'bpmn:Definitions') {
  const moddle = new BpmnModdle();

  const {
    rootElement: root,
    warnings = []
  } = await moddle.fromXML(xml, elementType, { lax: true });

  return {
    root,
    moddle,
    context: {
      warnings
    },
    warnings
  };
}

module.exports.createModdle = createModdle;


/**
 * Return moddle instance, read from the given file.
 *
 * @param {String} filePath
 *
 * @return {Promise<Object>}
 */
function readModdle(filePath) {
  const contents = readFileSync(filePath, 'utf8');

  return createModdle(contents);
}

module.exports.readModdle = readModdle;