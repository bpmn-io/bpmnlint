import traverse from '../../lib/traverse';

import {
  expect,
  createModdle,
  readModdle
} from '../helper';


describe('traverse', function() {

  describe('should visit each node', function() {

    it('diagram with multiple nodes', async function() {

      // given
      const {
        root
      } = await readModdle(__dirname + '/diagram.bpmn');

      let nodesCount = 0;

      const traverseCb = () => nodesCount++;

      // when
      traverse(root, traverseCb);

      // then
      expect(nodesCount).to.eql(15);
    });


    it('diagram with one node', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
            targetNamespace="http://bpmn.io/bpmn">
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      let nodesCount = 0;
      const traverseCb = () => nodesCount++;

      // when
      traverse(root, traverseCb);

      // then
      expect(nodesCount).to.eql(1);
    });


    it('diagram with generic element', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            xmlns:asd="http://asd"
            id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
            targetNamespace="http://bpmn.io/bpmn">
          <extensionElements>
            <asd:foo bar="BAR" />
          </extensionElements>
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      let nodesCount = 0;
      const traverseCb = () => nodesCount++;

      // when
      traverse(root, traverseCb);

      // then
      expect(nodesCount).to.eql(3);
    });

  });

});
