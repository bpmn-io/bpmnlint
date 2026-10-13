import { BpmnModdle } from 'bpmn-moddle';

import rule from '../../rules/no-overlapping-elements.js';

import {
  MAX_RATIO,
  expect,
  formatScaling,
  measureScaling
} from './helper.mjs';


describe('performance - no-overlapping-elements', function() {

  this.timeout(30000);

  // timing is noisy; a real regression fails consistently
  this.retries(2);


  it('should scale linearly with number of elements', function() {

    // when
    const { small, large, ratio, reports } = measureScaling({
      rule,
      size: 500,
      createModdleRoot: size => createTasksDiagram(size)
    });

    // then
    expect(reports.map(report => report.id)).to.eql([ 'Task_9_398', 'Task_9_399' ]);

    // see https://github.com/bpmn-io/bpmnlint/issues/216
    expect(ratio, formatScaling({ small, large, ratio })).to.be.below(MAX_RATIO);
  });

});


// helpers //////////

/**
 * Create a single process with <size> tasks, laid out left to right in
 * <rows> rows and connected by sequence flows. Only the last two tasks overlap.
 *
 * @param {number} size
 * @param {number} [rows=10]
 *
 * @return {Object} bpmn:Definitions moddle element
 */
function createTasksDiagram(size, rows = 10) {
  const moddle = new BpmnModdle();

  const flowElements = [];
  const planeElements = [];

  const columns = size / rows;

  for (let row = 0; row < rows; row++) {
    let previousTask;

    for (let column = 0; column < columns; column++) {
      const isLast = row === rows - 1 && column === columns - 1;

      const task = moddle.create('bpmn:Task', { id: `Task_${ row }_${ column }` });

      flowElements.push(task);

      planeElements.push(moddle.create('bpmndi:BPMNShape', {
        id: `${ task.id }_di`,
        bpmnElement: task,
        bounds: moddle.create('dc:Bounds', {
          x: 100 + column * 150 - (isLast ? 100 : 0),
          y: 100 + row * 150,
          width: 100,
          height: 80
        })
      }));

      if (previousTask) {
        const flow = moddle.create('bpmn:SequenceFlow', {
          id: `Flow_${ row }_${ column }`,
          sourceRef: previousTask,
          targetRef: task
        });

        flowElements.push(flow);

        planeElements.push(moddle.create('bpmndi:BPMNEdge', {
          id: `${ flow.id }_di`,
          bpmnElement: flow
        }));
      }

      previousTask = task;
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
