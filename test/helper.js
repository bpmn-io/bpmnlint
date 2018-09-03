import BpmnModdle from 'bpmn-moddle';

import { readFileSync } from 'fs';

import utils from '../lib/utils';

export { expect } from 'chai';

/**
 * Create moddle instance.
 *
 * @param {String} xml the XML string
 *
 * @return {Promise<Object>}
 */
export function createModdle(xml, elementType = 'bpmn:Definitions') {
  const moddle = new BpmnModdle();

  return new Promise((resolve, reject) => {
    moddle.fromXML(xml, elementType, { lax: true }, function(err, root, context) {
      if (err) {
        return reject(err);
      } else {
        return resolve({
          root,
          context,
          moddle
        });
      }
    });
  });
}

/**
 * Return moddle instance, read from the given file.
 *
 * @param  {String} filePath
 *
 * @return {Promise<Object>}
 */
export function readModdle(filePath) {
  const contents = readFileSync(filePath, 'utf8');

  return createModdle(contents);
}

export function createRule(ruleFactory) {
  return ruleFactory(utils);
}
