// @ts-expect-error 'missing <bpmn-moddle> types'
import BpmnModdle from 'bpmn-moddle';

import { readFileSync } from 'node:fs';


/**
 * Create moddle instance.
 *
 * @param {String} xml the XML string
 *
 * @return {Promise<Object>}
 */
export async function createModdle(xml, elementType = 'bpmn:Definitions') {
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


/**
 * Return moddle instance, read from the given file.
 *
 * @param {String} filePath
 *
 * @return {Promise<Object>}
 */
export function readModdle(filePath) {
  const contents = readFileSync(filePath, 'utf8');

  return createModdle(contents);
}