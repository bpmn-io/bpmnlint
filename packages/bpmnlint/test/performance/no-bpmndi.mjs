import { BpmnModdle } from 'bpmn-moddle';

import rule from '../../rules/no-bpmndi.js';

import {
  MAX_RATIO,
  expect,
  formatScaling,
  measureScaling
} from './helper.mjs';


describe('performance - no-bpmndi', function() {

  this.timeout(30000);

  // timing is noisy; a real regression fails consistently
  this.retries(2);


  it('should scale linearly with number of elements', function() {

    // given
    const missingDi = (index, size) => index === 0 || index === size - 1;

    // when
    const { small, large, ratio, reports } = measureScaling({
      rule,
      size: 500,
      createModdleRoot: size => createTasksDiagram(size, { missingDi })
    });

    // then
    expect(reports.map(report => report.id)).to.eql([ 'Task_0', 'Task_3999' ]);

    // see https://github.com/bpmn-io/bpmnlint/pull/217
    expect(ratio, formatScaling({ small, large, ratio })).to.be.below(MAX_RATIO);
  });

});


// helpers //////////

/**
 * Create a single process with <size> tasks, each with a BPMNShape,
 * except for the ones matched by <missingDi>.
 *
 * @param {number} size
 * @param {Object} [options]
 * @param {(index: number, size: number) => boolean} [options.missingDi]
 *
 * @return {Object} bpmn:Definitions moddle element
 */
function createTasksDiagram(size, { missingDi = () => false } = {}) {
  const moddle = new BpmnModdle();

  const flowElements = [];
  const planeElements = [];

  for (let i = 0; i < size; i++) {
    const task = moddle.create('bpmn:Task', { id: `Task_${ i }` });

    flowElements.push(task);

    if (!missingDi(i, size)) {
      planeElements.push(moddle.create('bpmndi:BPMNShape', {
        id: `${ task.id }_di`,
        bpmnElement: task
      }));
    }
  }

  const process = moddle.create('bpmn:Process', { id: 'Process_1', flowElements });

  const plane = moddle.create('bpmndi:BPMNPlane', {
    id: 'Plane_1',
    bpmnElement: process,
    planeElement: planeElements
  });

  const diagram = moddle.create('bpmndi:BPMNDiagram', { id: 'Diagram_1', plane });

  return moddle.create('bpmn:Definitions', {
    id: 'Definitions_1',
    rootElements: [ process ],
    diagrams: [ diagram ]
  });
}
