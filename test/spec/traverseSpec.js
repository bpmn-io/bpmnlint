import traverse from '../../lib/traverse';

import { expect, readModdle } from '../helper';

describe('traverse', function() {
  it('should traverse each node of a diagram with multiple nodes', async function() {
    // given
    const { root: moddleWithMultipleDef } = await readModdle({
      filePath: __dirname + '/diagram.bpmn'
    });
    let nodesCount = 0;
    const traverseCb = () => nodesCount++;

    // when
    traverse(moddleWithMultipleDef, traverseCb);

    // then
    expect(nodesCount).to.eql(15);
  });

  it('should traverse each node of a diagram with one node', async function() {
    // given
    const xmlStr = `
    <?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="http://bpmn.io" exporterVersion="0.10.1">
    </definitions>    
    `;

    const { root: moddleWithOneDef } = await readModdle({ content: xmlStr });
    let nodesCount = 0;
    const traverseCb = () => nodesCount++;

    // when
    traverse(moddleWithOneDef, traverseCb);

    // then
    expect(nodesCount).to.eql(1);
  });
});
