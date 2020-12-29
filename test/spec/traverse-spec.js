import traverse from '../../lib/traverse';

import {
  expect,
  createModdle,
  readModdle
} from '../helper';


describe('traverse', function() {

  describe('traversal', function() {

    it('should traverse diagram with one node', async function() {

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
        'bpmn:Definitions#Definitions - enter'
      ]);
    });


    it('should traverse diagram with generic element', async function() {

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
        'bpmn:Definitions#Definitions - enter',
        'bpmn:ExtensionElements - enter',
        'asd:foo - enter'
      ]);
    });


    it('should traverse diagram with collaboration', async function() {

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
        'bpmn:Definitions#sid-38422fae-e03e-43a3-bef4-bd33b32041b2 - enter',
        'bpmn:Collaboration#Collaboration_0wzd2dx - enter',
        'bpmn:Participant#Participant_03hz6qm - enter',
        'bpmn:Participant#Participant_1w6hx42 - enter',
        'bpmn:MessageFlow#MessageFlow_1ofxm38 - enter',
        'bpmn:Process#Process_1 - enter',
        'bpmndi:BPMNDiagram#BpmnDiagram_1 - enter',
        'bpmndi:BPMNPlane#BpmnPlane_1 - enter',
        'bpmndi:BPMNShape#Participant_03hz6qm_di - enter',
        'dc:Bounds - enter',
        'bpmndi:BPMNEdge#MessageFlow_1ofxm38_di - enter',
        'dc:Point - enter',
        'dc:Point - enter',
        'bpmndi:BPMNShape#Participant_1sh3ce3_di - enter',
        'dc:Bounds - enter'
      ]);
    });


    it('should traverse diagram with simple process', async function() {

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
        'bpmn:Definitions#Definitions_1 - enter',
        'bpmn:Process#Process_1 - enter',
        'bpmn:StartEvent#Event_1 - enter',
        'bpmn:Task#Activity_1 - enter',
        'bpmn:SequenceFlow#Flow_1 - enter',
        'bpmndi:BPMNDiagram#BpmnDiagram_1 - enter',
        'bpmndi:BPMNPlane#BpmnPlane_1 - enter',
        'bpmndi:BPMNEdge#Flow_1_di - enter',
        'dc:Point - enter',
        'dc:Point - enter',
        'bpmndi:BPMNShape#Event_1_di - enter',
        'dc:Bounds - enter',
        'bpmndi:BPMNLabel - enter',
        'dc:Bounds - enter',
        'bpmndi:BPMNShape#Activity_1_di - enter',
        'dc:Bounds - enter'
      ]);
    });

  });


  describe('enter/leave hooks', function() {

    it('should <enter> and <leave>', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
          <process id="Process_1"/>
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      const {
        nodes,
        log
      } = createLogger([ 'enter', 'leave' ]);

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions - enter',
        'bpmn:Process#Process_1 - enter',
        'bpmn:Process#Process_1 - leave',
        'bpmn:Definitions#Definitions - leave'
      ]);
    });


    it('should <leave> only', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
          <process id="Process_1"/>
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      const {
        nodes,
        log
      } = createLogger([ 'leave' ]);

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Process#Process_1 - leave',
        'bpmn:Definitions#Definitions - leave'
      ]);
    });


    it('should <enter> and <leave> generic element', async function() {

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
      } = createLogger([ 'enter', 'leave' ]);

      // when
      traverse(root, log);

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions - enter',
        'bpmn:ExtensionElements - enter',
        'asd:foo - enter',
        'asd:foo - leave',
        'bpmn:ExtensionElements - leave',
        'bpmn:Definitions#Definitions - leave'
      ]);
    });

  });


  describe('sub-tree skipping', function() {

    it('should skip if <enter> returns false', async function() {

      // given
      const xmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <definitions
            xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
            id="Definitions"
            targetNamespace="http://bpmn.io/bpmn">
          <bpmn:process id="Process_1">
            <bpmn:task id="Task_1" />
          </bpmn:process>
          <bpmn:process id="Process_2">
            <bpmn:task id="Task_2" />
          </bpmn:process>
        </definitions>
      `;

      const {
        root
      } = await createModdle(xmlStr);

      const {
        nodes,
        log
      } = createLogger([ 'enter', 'leave' ]);

      // when
      traverse(root, {
        enter: (node) => {
          log.enter(node);

          if (node.id === 'Process_1') {
            return false;
          }

          // does nothing
          return null;
        },
        leave: log.leave
      });

      // then
      expect(nodes).to.eql([
        'bpmn:Definitions#Definitions - enter',
        'bpmn:Process#Process_1 - enter',
        'bpmn:Process#Process_1 - leave',
        'bpmn:Process#Process_2 - enter',
        'bpmn:Task#Task_2 - enter',
        'bpmn:Task#Task_2 - leave',
        'bpmn:Process#Process_2 - leave',
        'bpmn:Definitions#Definitions - leave'
      ]);
    });

  });

});


// helpers ///////////////

function createLogger(hooks = [ 'enter' ]) {

  const nodes = [];

  const log = hooks.reduce((log, hook) => {

    log[hook] = (node) => {
      nodes.push(node.$type + (node.id ? '#' + node.id : '') + ' - ' + hook);
    };

    return log;
  }, {});

  return {
    nodes,
    log
  };
}