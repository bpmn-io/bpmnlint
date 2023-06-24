const {
  is
} = require('bpmnlint-utils');


/**
 * Rule that checks if two elements overlap except:
 * - Boundary events overlap their host
 * - Child elements overlap / are on top of their parent (e.g., elements within a subProcess)
 */
module.exports = function() {

  function check(node, reporter) {
    if (!is(node, 'bpmn:Definitions')) {
      return;
    }

    const rootElements = node.rootElements || [];
    const elementsToReport = new Set();
    const diObjects = getAllDiObjects(node);

    rootElements.forEach(element => {
      if (is(element, 'bpmn:Collaboration')) {
        const participants = element.participants || [];
        checkElementsArray(participants, elementsToReport, diObjects);
      } else if (is(element, 'bpmn:Process')) {
        checkProcess(element, elementsToReport, diObjects);
      }
    });

    elementsToReport.forEach(element => reporter.report(element.id, 'Element overlaps with other element'));
  }

  return {
    check: check
  };
};

// helpers /////////////////

/**
 * Recursively check subprocesses in a process
 * @param {Object} node Process or SubProcess
 * @param {Set} elementsToReport
 */
function checkProcess(node, elementsToReport, diObjects) {
  const flowElements = node.flowElements || [];
  checkElementsArray(flowElements, elementsToReport, diObjects);

  const subProcesses = flowElements.filter(element => is(element, 'bpmn:SubProcess'));
  subProcesses.forEach(subProcess => checkProcess(subProcess, elementsToReport, diObjects));
}

/**
 * @param {Array} elements
 * @param {Set} elementsToReport
 */
function checkElementsArray(elements, elementsToReport, diObjects) {
  for (let i = 0; i < elements.length - 1; i++) {
    const element = elements[i];
    for (let j = i + 1; j < elements.length; j++) {
      const element2 = elements[j];

      if (!diObjects.has(element) || !diObjects.has(element2)) {
        continue;
      }

      // ignore if Boundary events overlap their host
      // but still check if they overlap other elements
      if (element.attachedToRef === element2 || element2.attachedToRef === element) {
        continue;
      }

      if (isCollision(diObjects.get(element).bounds, diObjects.get(element2).bounds)) {
        elementsToReport.add(element);
        elementsToReport.add(element2);
      }
    }
  }
}

/**
 * Check if two rectangle shapes collides
 */
function isCollision(firstBounds, secondBounds) {
  if (!isValidShapeElement(firstBounds) || !isValidShapeElement(secondBounds)) {
    return false;
  }

  const collisionX = firstBounds.x + firstBounds.width >= secondBounds.x && secondBounds.x + secondBounds.width >= firstBounds.x;
  const collisionY = firstBounds.y + firstBounds.height >= secondBounds.y && secondBounds.y + secondBounds.height >= firstBounds.y;

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
