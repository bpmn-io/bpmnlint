import traverse from '../../lib/traverse';

import {
  expect,
  createModdle,
  readModdle
} from '../helper';


describe('traverse', function() {

  describe('should visit each node', function() {

    it('diagram with one node', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      const {
        nodes,
        log
      } = createLogger();

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions'
      ]);
    });


    it('diagram with generic element', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            xmlns:asd="http://asd"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
          <extensionElements>
            <asd:foo bar="BAR" />
          </extensionElements>
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      const {
        nodes,
        log
      } = createLogger();

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions',
        'bpmn:ExtensionElements',
        'asd:foo'
      ]);
    });


    it('diagram with collaboration', async function() {

      // given
      const {
        root
      } = await readModdle(__dirname + '/diagram.bpmn');

      const {
        nodes,
        log
      } = createLogger();

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        'bpmn:Collaboration#Collaboration_0wzd2dx',
        'bpmn:Participant#Participant_03hz6qm',
        'bpmn:Participant#Participant_1w6hx42',
        'bpmn:MessageFlow#MessageFlow_1ofxm38',
        'bpmn:Process#Process_1',
        'bpmndi:BPMNDiagram#BpmnDiagram_1',
        'bpmndi:BPMNPlane#BpmnPlane_1',
        'bpmndi:BPMNShape#Participant_03hz6qm_di',
        'dc:Bounds',
        'bpmndi:BPMNEdge#MessageFlow_1ofxm38_di',
        'dc:Point',
        'dc:Point',
        'bpmndi:BPMNShape#Participant_1sh3ce3_di',
        'dc:Bounds'
      ]);
    });


    it('diagram with simple process', async function() {

      // given
      const {
        root
      } = await readModdle(__dirname + '/process-diagram.bpmn');

      const {
        nodes,
        log
      } = createLogger();

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions_1',
        'bpmn:Process#Process_1',
        'bpmn:StartEvent#Event_1',
        'bpmn:Task#Activity_1',
        'bpmn:SequenceFlow#Flow_1',
        'bpmndi:BPMNDiagram#BpmnDiagram_1',
        'bpmndi:BPMNPlane#BpmnPlane_1',
        'bpmndi:BPMNEdge#Flow_1_di',
        'dc:Point',
        'dc:Point',
        'bpmndi:BPMNShape#Event_1_di',
        'dc:Bounds',
        'bpmndi:BPMNLabel',
        'dc:Bounds',
        'bpmndi:BPMNShape#Activity_1_di',
        'dc:Bounds'
      ]);
    });

  });

});


function createLogger() {

  const nodes = [];

  const log = (node) => {
    nodes.push(node.$type + (node.id ? '#' + node.id : ''));
  };

  return {
    nodes,
    log
  };
}