import {
  createModdle,
  readModdle
} from 'bpmnlint/lib/testers/helper.js';

import {
  is
} from 'bpmnlint-utils';

import {
  expect
} from '../../helper.mjs';

const testModdle = {
  name: 'TestModdle',
  uri: 'http://test/schema',
  prefix: 't',
  xml: {
    tagAlias: 'lowerCase'
  },
  types: [
    {
      name: 'TestDefinitions',
      extends: [ 'bpmn:Definitions' ],
      properties: []
    }
  ]
};


describe('testers/helper', function() {

  describe('#createModdle', function() {

    it('should create moddle with extension', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions
            xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
          <bpmn:process id="Process_1">
          </bpmn:process>
        </bpmn:definitions>
      `;


      // when
      const {
        root
      } = await createModdle(xmlStr, {
        t: testModdle
      });


      // then
      expect(is(root, 't:TestDefinitions')).to.be.true;
    });

  });


  describe('#readModdle', function() {

    it('should read moddle with extension', async function() {

      // given
      const filePath = new URL('./diagram.bpmn', import.meta.url);

      // when
      const {
        root
      } = await readModdle(filePath, {
        t: testModdle
      });

      // then
      expect(is(root, 't:TestDefinitions')).to.be.true;
    });

  });
});