const {
  is
} = require('bpmnlint-utils');

const {
  annotateRule
} = require('./helper');


/**
 * Default element sizes.
 *
 * NOTE: Kept in sync with `bpmn-js`
 * (`lib/util/ElementSizeUtil.js`). We intentionally copy the values
 * here to avoid a (heavy) dependency on `bpmn-js`.
 *
 * @type { Record<string, { width: number, height: number }> }
 */
const DEFAULT_SIZES = {
  'bpmn:Task': { width: 100, height: 80 },
  'bpmn:CallActivity': { width: 100, height: 80 },
  'bpmn:SubProcess': { width: 100, height: 80 }, // collapsed
  'bpmn:Gateway': { width: 50, height: 50 },
  'bpmn:Event': { width: 36, height: 36 },
  'bpmn:DataObjectReference': { width: 36, height: 50 },
  'bpmn:DataStoreReference': { width: 50, height: 50 },
  'bpmn:Participant': { width: 60, height: 60 } // collapsed breadth (empty pool)
};

/**
 * Element types resolved through the generic size lookup, most specific first.
 *
 * NOTE: `bpmn:Participant` is handled separately (empty pools only).
 *
 * @type { string[] }
 */
const CHECKED_TYPES = [
  'bpmn:SubProcess',
  'bpmn:CallActivity',
  'bpmn:Task',
  'bpmn:Gateway',
  'bpmn:Event',
  'bpmn:DataObjectReference',
  'bpmn:DataStoreReference'
];


/**
 * A rule that checks that elements have a standard (default) size.
 *
 * Resizable containers, whose size follows their content, are excluded:
 *
 *   * expanded sub-processes
 *   * participants (pools) with content
 *   * lanes
 *
 * Empty pools (no `processRef`) are only checked for their fixed dimension,
 * i.e. the default height for horizontally modeled and the default width for
 * vertically modeled diagrams.
 *
 * Standard sizes are configurable per element type:
 *
 * ```json
 * {
 *   "rules": {
 *     "standard-size": [ "warn", {
 *       "bpmn:Task": { "width": 120, "height": 80 }
 *     } ]
 *   }
 * }
 * ```
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
module.exports = function(config) {

  const sizes = {
    ...DEFAULT_SIZES,
    ...(config || {})
  };

  function check(node, reporter) {

    // check each shape as we traverse the DI, avoiding a separate pass;
    // each element is validated independently based on its own bounds
    if (!is(node, 'bpmndi:BPMNShape')) {
      return;
    }

    const element = node.bpmnElement;
    const bounds = node.bounds;

    // only check shapes with a linked element and proper bounds
    if (!element || !isValidBounds(bounds)) {
      return;
    }

    const expected = getExpectedSize(element, node, sizes);

    // ignore elements without an expected size or with a malformed
    // (non-object) size configuration
    if (!expected || typeof expected !== 'object') {
      return;
    }

    const widthMismatch = typeof expected.width === 'number' && bounds.width !== expected.width;
    const heightMismatch = typeof expected.height === 'number' && bounds.height !== expected.height;

    if (!widthMismatch && !heightMismatch) {
      return;
    }

    reporter.report(element.id, getMessage(expected));
  }

  return annotateRule('standard-size', {
    check
  });
};


// helpers ////////////////////////

/**
 * Determine the expected (standard) size of an element or `null` if the
 * element must not be checked.
 *
 * The returned object may contain only `width` or only `height`, in which case
 * just that dimension is checked (empty pools).
 *
 * @param { Object } element
 * @param { Object } di
 * @param { Record<string, { width: number, height: number }> } sizes
 *
 * @return { { width?: number, height?: number } | null }
 */
function getExpectedSize(element, di, sizes) {

  // participants (pools)
  if (is(element, 'bpmn:Participant')) {

    // pools with content follow their content
    if (element.processRef) {
      return null;
    }

    const horizontal = isHorizontal(di);

    // empty pools are only checked for their fixed dimension:
    // the height for horizontal, the width for vertical pools
    const participantSize = sizes['bpmn:Participant'] || {};
    const value = horizontal ? participantSize.height : participantSize.width;

    // ignore missing / malformed configuration
    if (typeof value !== 'number') {
      return null;
    }

    return horizontal
      ? { height: value }
      : { width: value };
  }

  // lanes follow their content
  if (is(element, 'bpmn:Lane')) {
    return null;
  }

  // expanded sub-processes follow their content
  if (is(element, 'bpmn:SubProcess') && isExpanded(di)) {
    return null;
  }

  const type = CHECKED_TYPES.find(type => is(element, type));

  if (!type) {
    return null;
  }

  return sizes[type];
}

/**
 * @param { { width?: number, height?: number } } expected
 *
 * @return { string }
 */
function getMessage(expected) {
  if (typeof expected.height !== 'number') {
    return `Element has a non-standard width; expected width of ${expected.width}`;
  }

  if (typeof expected.width !== 'number') {
    return `Element has a non-standard height; expected height of ${expected.height}`;
  }

  return `Element has a non-standard size; expected ${expected.width}x${expected.height}`;
}

/**
 * Check whether a sub-process DI is expanded.
 *
 * NOTE: Adapted from `bpmn-js` (`lib/util/DiUtil.js`).
 *
 * @param { Object } di
 *
 * @return { boolean }
 */
function isExpanded(di) {
  return !!di && !!di.isExpanded;
}

/**
 * Check whether a participant / pool DI is modeled horizontally.
 *
 * NOTE: Adapted from `bpmn-js` (`lib/util/DiUtil.js`).
 *
 * @param { Object } di
 *
 * @return { boolean }
 */
function isHorizontal(di) {
  return !di || di.isHorizontal === undefined || di.isHorizontal === true;
}

/**
 * @param { Object } bounds
 *
 * @return { boolean }
 */
function isValidBounds(bounds) {
  return !!bounds && is(bounds, 'dc:Bounds') &&
    typeof bounds.width === 'number' &&
    typeof bounds.height === 'number';
}
