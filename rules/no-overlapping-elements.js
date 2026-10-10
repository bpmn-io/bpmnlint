const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');

/**
 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
 *
 * @typedef { {
 *   element: ModdleElement,
 *   left: number,
 *   right: number,
 *   top: number,
 *   bottom: number
 * } } Shape
 */


/**
 * Rule that checks if two elements overlap except:
 *
 * - Boundary events overlap their host
 * - Child elements overlap / are on top of their parent (e.g., elements within a subProcess)
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {
    if (!is(node, 'bpmn:Definitions')) {
      return;
    }

    const rootElements = node.rootElements || [];
    const elementsToReport = new Set();
    const elementsOutsideToReport = new Set();
    const diObjects = getAllDiObjects(node);
    const processElementsParentDiMap = new Map(); // map with sub/process as key and its parent boundary di object

    rootElements
      .filter(element => is(element, 'bpmn:Collaboration'))
      .forEach(collaboration => {
        const participants = collaboration.participants || [];
        checkElementsArray(participants, elementsToReport, diObjects);

        participants.forEach(participant => {
          processElementsParentDiMap.set(participant.processRef, diObjects.get(participant));
        });
      });

    rootElements
      .filter(element => is(element, 'bpmn:Process'))
      .forEach(process => {
        const parentDi = processElementsParentDiMap.get(process) || {};
        checkProcess(process, elementsToReport, elementsOutsideToReport, diObjects, parentDi);
      });

    // report elements
    elementsToReport.forEach(element => reporter.report(element.id, 'Element overlaps with other element'));
    elementsOutsideToReport.forEach(element => reporter.report(element.id, 'Element is outside of parent boundary'));
  }

  return annotateRule('no-overlapping-elements', {
    check
  });
};

// helpers /////////////////

/**
 * Recursively check subprocesses in a process
 * @param {Object} node Process or SubProcess
 * @param {Set} elementsToReport
 * @param {Set} elementsOutsideToReport
 * @param {Map} diObjects
 */
function checkProcess(node, elementsToReport, elementsOutsideToReport, diObjects, parentDi) {

  const flowElements = node.flowElements || [];

  const flowElementsWithDi = flowElements.filter(element => diObjects.has(element));

  // check child elements for overlap
  checkElementsArray(flowElementsWithDi, elementsToReport, diObjects);

  // check child elements outside parent boundary
  //
  //   * data objects do not have a visual representation
  //   * for historical reasons data store references may be
  //     outside of parent boundaries
  //
  flowElementsWithDi.forEach(element => {
    if (
      !is(element, 'bpmn:DataStoreReference') &&
      isOutsideParentBoundary(diObjects.get(element).bounds, parentDi.bounds)
    ) {
      elementsOutsideToReport.add(element);
    }
  });

  // recurse into subprocesses
  const subProcesses = flowElements.filter(element => is(element, 'bpmn:SubProcess'));
  subProcesses.forEach(subProcess => {
    const subProcessDi = diObjects.get(subProcess) || {};
    const subProcessParentBoundary = subProcessDi.isExpanded ? subProcessDi : {};
    checkProcess(subProcess, elementsToReport, elementsOutsideToReport, diObjects, subProcessParentBoundary);
  });
}

/**
 * Check elements for overlap.
 *
 * Sweeps the shapes of the elements from left to right, so that every shape
 * is only compared with the shapes that start before it ends.
 *
 * @param {Array} elements
 * @param {Set} elementsToReport
 * @param {Map} diObjects
 */
function checkElementsArray(elements, elementsToReport, diObjects) {
  const shapes = getShapes(elements, diObjects).sort((a, b) => a.left - b.left);

  const overlapping = new Set();

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    // shapes starting right of this one cannot overlap it
    for (let j = i + 1; j < shapes.length && shapes[j].left <= shape.right; j++) {
      const otherShape = shapes[j];

      if (!isCollision(shape, otherShape)) {
        continue;
      }

      // ignore if Boundary events overlap their host
      // but still check if they overlap other elements
      if (shape.element.attachedToRef === otherShape.element || otherShape.element.attachedToRef === shape.element) {
        continue;
      }

      overlapping.add(shape.element);
      overlapping.add(otherShape.element);
    }
  }

  // report in element order, independent of the order overlaps are detected
  elements.forEach(element => {
    if (overlapping.has(element)) {
      elementsToReport.add(element);
    }
  });
}

/**
 * Get the shapes of all elements with valid bounds, the only elements
 * that can overlap.
 *
 * @param {Array} elements
 * @param {Map} diObjects
 *
 * @return {Shape[]}
 */
function getShapes(elements, diObjects) {
  const shapes = [];

  elements.forEach(element => {
    const bounds = diObjects.get(element)?.bounds;

    if (!isValidShapeElement(bounds)) {
      return;
    }

    const left = bounds.x;
    const right = bounds.x + bounds.width;

    // shapes with a NaN left or right edge never collide,
    // and a NaN left edge would break the sweep
    if (Number.isNaN(left) || Number.isNaN(right)) {
      return;
    }

    shapes.push({
      element,
      left,
      right,
      top: bounds.y,
      bottom: bounds.y + bounds.height
    });
  });

  return shapes;
}

/**
 * Check if child element is outside of parent boundary
 */
function isOutsideParentBoundary(childBounds, parentBounds) {
  if (!isValidShapeElement(childBounds) || !isValidShapeElement(parentBounds)) {
    return false;
  }

  const isTopLeftCornerInside = childBounds.x >= parentBounds.x && childBounds.y >= parentBounds.y;
  const isBottomRightCornerInside = childBounds.x + childBounds.width <= parentBounds.x + parentBounds.width && childBounds.y + childBounds.height <= parentBounds.y + parentBounds.height;
  const isInside = isTopLeftCornerInside && isBottomRightCornerInside;

  return !isInside;
}

/**
 * Check if two rectangle shapes collides
 *
 * @param {Shape} firstShape
 * @param {Shape} secondShape
 *
 * @return {boolean}
 */
function isCollision(firstShape, secondShape) {
  const collisionX = firstShape.right >= secondShape.left && secondShape.right >= firstShape.left;
  const collisionY = firstShape.bottom >= secondShape.top && secondShape.bottom >= firstShape.top;

  // collision on both axis
  return collisionX && collisionY;
}

/**
 * Checks if shape bounds has all necessary values for collision check
 */
function isValidShapeElement(bounds) {
  return !!bounds && is(bounds, 'dc:Bounds') &&
    typeof (bounds.x) === 'number' &&
    typeof (bounds.y) === 'number' &&
    typeof (bounds.width) === 'number' &&
    typeof (bounds.height) === 'number';
}

/**
 * Get all di object as one map object
 * @param {Object} node bpmn:Definitions
 * @returns {Map<Object, Object>} map of di objects with element as key
 */
function getAllDiObjects(node) {
  const diObjects = new Map();
  const diagrams = node.diagrams || [];

  diagrams
    .filter(diagram => !!diagram.plane)
    .forEach(diagram => {
      const planeElements = diagram.plane.planeElement || [];
      planeElements
        .filter(planeElement => !!planeElement.bpmnElement)
        .forEach(planeElement => {
          diObjects.set(planeElement.bpmnElement, planeElement);
        });
    });

  return diObjects;
}
