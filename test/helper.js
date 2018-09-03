import BpmnModdle from 'bpmn-moddle';

import { readFileSync } from 'fs';

import utils from '../lib/utils';

export { expect } from 'chai';

/**
 * Create moddle instance.
 *
 * @return {Moddle}
 */
export function createModdle() {
  return new BpmnModdle();
}


/**
 * Return moddle instance, read from the given file.
 *
 * @param  {String} filePath
 *
 * @return {Promise<ModdleElement>}
 */
export function readModdle(filePath) {

  const contents = readFileSync(filePath, 'utf8');

  const moddle = createModdle();

  return new Promise((resolve, reject) => {
    moddle.fromXML(contents, { lax: true }, function(err, root, context) {

      if (err) {
        return reject(err);
      } else {
        return resolve({
          root,
          context,
          moddle
        });
      }
    })
  });

}


export function createRule(ruleFactory) {
  return ruleFactory(utils);
}