const {
  is
} = require('bpmnlint-utils');

const {
  flatten
} = require('min-dash');

const {
  annotateRule
} = require('./helper');

/**
 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
 */


/**
 * A rule that checks that there is no BPMNDI information missing for elements,
 * which require BPMNDI.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:Definitions')) {
      return false;
    }

    // (1) Construct array of all BPMN elements
    const bpmnElements = getAllBpmnElements(node.rootElements);

    // (2) Filter BPMN elements without visual representation
    const visualBpmnElements = bpmnElements.filter(hasVisualRepresentation);

    // (3) Construct array of BPMNDI references
    const diBpmnReferences = getAllDiBpmnReferences(node);

    // (4) Report elements without BPMNDI
    visualBpmnElements.forEach((element) => {
      if (diBpmnReferences.indexOf(element.id) === -1) {
        reporter.report(element.id, 'Element is missing bpmndi');
      }
    });
  }

  return annotateRule('no-bpmndi', {
    check
  });

};


// helpers /////////////////////////////

/**
 * Get all BPMN elements within a bpmn:Definitions node
 *
 * @param { ModdleElement[] } rootElements - An array of Moddle rootElements
 *
 * @return { { id: string, $type: string }[] } A flat array with all BPMN elements, each represented with { id: elementId, $type: elementType }
 */
function getAllBpmnElements(rootElements) {

  return flatten(rootElements.map((rootElement) => {
    const laneSet =
      rootElement.laneSets && rootElement.laneSets[0] || rootElement.childLaneSet;

    // Include
    // * flowElements (e.g., tasks, sequenceFlows),
    // * nested flowElements,
    // * participants,
    // * artifacts (groups),
    // * laneSets
    // * nested laneSets
    // * childLaneSets
    // * nested childLaneSets
    // * messageFlows
    const elements = flatten([
      rootElement.flowElements || [],
      (rootElement.flowElements && getAllBpmnElements(rootElement.flowElements.filter(hasFlowElements))) || [],
      rootElement.participants || [],
      rootElement.artifacts || [],
      laneSet && laneSet.lanes || [],
      laneSet && laneSet.lanes && getAllBpmnElements(laneSet.lanes.filter(hasChildLaneSet)) || [],
      rootElement.messageFlows || []
    ]);

    if (elements.length > 0) {
      return elements.map((element) => {

        return {
          id: element.id,
          $type: element.$type
        };
      });
    } else {

      // We are not interested in the rest here (DI)
      return [];
    }
  }));
}

/**
 * Get all BPMN elements within a bpmn:Definitions node
 *
 * @param {ModdleElement} definitionsNode - A moddleElement representing the
 *   bpmn:Definitions element
 *
 * @return {string[]} ids of all BPMNDI element part of
 *   this bpmn:Definitions node
 */
function getAllDiBpmnReferences(definitionsNode) {
  return flatten(
    definitionsNode.get('diagrams').map((diagram) => {

      const diElements = diagram.plane.planeElement || [];

      return diElements.map((element) => {

        return element.bpmnElement?.id;
      });
    })
  );
}

/**
 * @param { ModdleElement } element
 *
 * @return {boolean}
 */
function hasVisualRepresentation(element) {
  const noVisRepresentation = [ 'bpmn:DataObject' ];

  return noVisRepresentation.includes(element.$type) ? false : true;
}

/**
 * @param { ModdleElement } element
 *
 * @return {boolean}
 */
function hasFlowElements(element) {
  return element.flowElements ? true : false;
}

/**
 * @param { ModdleElement } element
 *
 * @return {boolean}
 */
function hasChildLaneSet(element) {
  return element.childLaneSet ? true : false;
}
