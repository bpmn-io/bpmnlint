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
 *   index: number,
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
 * is only compared with the shapes that do not end left of it.
 *
 * @param {Array} elements
 * @param {Set} elementsToReport
 * @param {Map} diObjects
 */
function checkElementsArray(elements, elementsToReport, diObjects) {
  const shapes = getShapes(elements, diObjects).sort((a, b) => a.left - b.left);

  // index of an overlapping element -> lowest index of an element it overlaps
  const lowestOverlappedIndices = new Map();

  let candidates = [];

  shapes.forEach(shape => {

    // shapes ending left of this one cannot overlap it or any shape after it
    candidates = candidates.filter(candidate => candidate.right >= shape.left);

    candidates.forEach(candidate => {

      if (!isCollision(candidate, shape)) {
        return;
      }

      // ignore if Boundary events overlap their host
      // but still check if they overlap other elements
      if (candidate.element.attachedToRef === shape.element || shape.element.attachedToRef === candidate.element) {
        return;
      }

      setLowestOverlappedIndex(lowestOverlappedIndices, candidate.index, shape.index);
      setLowestOverlappedIndex(lowestOverlappedIndices, shape.index, candidate.index);
    });

    candidates.push(shape);
  });

  sortInReportOrder(lowestOverlappedIndices).forEach(index => elementsToReport.add(elements[index]));
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

  elements.forEach((element, index) => {
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
      index,
      left,
      right,
      top: bounds.y,
      bottom: bounds.y + bounds.height
    });
  });

  return shapes;
}

/**
 * @param {Map<number, number>} lowestOverlappedIndices
 * @param {number} index
 * @param {number} overlappedIndex
 */
function setLowestOverlappedIndex(lowestOverlappedIndices, index, overlappedIndex) {
  const lowestOverlappedIndex = lowestOverlappedIndices.get(index);

  if (lowestOverlappedIndex === undefined || overlappedIndex < lowestOverlappedIndex) {
    lowestOverlappedIndices.set(index, overlappedIndex);
  }
}

/**
 * Sort overlapping elements as if every pair of elements (i, j), i < j, was
 * checked in element order: an element is reported with the first overlapping
 * pair it is part of, i before j. That pair is formed with the lowest index
 * the element overlaps.
 *
 * @param {Map<number, number>} lowestOverlappedIndices
 *
 * @return {number[]} indices of the overlapping elements
 */
function sortInReportOrder(lowestOverlappedIndices) {
  const firstOverlappingPairs = Array.from(lowestOverlappedIndices, ([ index, lowestOverlappedIndex ]) => ({
    index,
    i: Math.min(index, lowestOverlappedIndex),
    j: Math.max(index, lowestOverlappedIndex)
  }));

  return firstOverlappingPairs
    .sort((a, b) => a.i - b.i || a.j - b.j || a.index - b.index)
    .map(pair => pair.index);
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
