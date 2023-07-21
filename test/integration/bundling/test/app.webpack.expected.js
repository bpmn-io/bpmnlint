/******/ (() => { // webpackBootstrap
/******/   var __webpack_modules__ = ({

/***/ "./src/.bpmnlintrc":
/*!*************************!*\
  !*** ./src/.bpmnlintrc ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   resolver: () => (/* binding */ resolver)
/* harmony export */ });
/* harmony import */ var bpmnlint_rules_label_required__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmnlint/rules/label-required */ "./node_modules/bpmnlint/rules/label-required.js");
/* harmony import */ var bpmnlint_rules_label_required__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bpmnlint_rules_label_required__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bpmnlint_rules_start_event_required__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bpmnlint/rules/start-event-required */ "./node_modules/bpmnlint/rules/start-event-required.js");
/* harmony import */ var bpmnlint_rules_start_event_required__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bpmnlint_rules_start_event_required__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var bpmnlint_rules_end_event_required__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bpmnlint/rules/end-event-required */ "./node_modules/bpmnlint/rules/end-event-required.js");
/* harmony import */ var bpmnlint_rules_end_event_required__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bpmnlint_rules_end_event_required__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var bpmnlint_plugin_exported_src_foo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bpmnlint-plugin-exported/src/foo */ "./node_modules/bpmnlint-plugin-exported/src/foo.js");
/* harmony import */ var bpmnlint_plugin_exported_src_foo__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bpmnlint_plugin_exported_src_foo__WEBPACK_IMPORTED_MODULE_3__);

const cache = {};

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 *
 * @param {Object} cache
 */
function Resolver() {}

Resolver.prototype.resolveRule = function(pkg, ruleName) {

  const rule = cache[pkg + '/' + ruleName];

  if (!rule) {
    throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>: not bundled');
  }

  return rule;
};

Resolver.prototype.resolveConfig = function(pkg, configName) {
  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>: not bundled'
  );
};

const resolver = new Resolver();

const rules = {
  "label-required": 1,
  "start-event-required": "info",
  "end-event-required": 2,
  "exported/foo": "error",
  "exported/foo-absolute": "error"
};

const config = {
  rules: rules
};

const bundle = {
  resolver: resolver,
  config: config
};



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bundle);



cache['bpmnlint/label-required'] = (bpmnlint_rules_label_required__WEBPACK_IMPORTED_MODULE_0___default());



cache['bpmnlint/start-event-required'] = (bpmnlint_rules_start_event_required__WEBPACK_IMPORTED_MODULE_1___default());



cache['bpmnlint/end-event-required'] = (bpmnlint_rules_end_event_required__WEBPACK_IMPORTED_MODULE_2___default());



cache['bpmnlint-plugin-exported/foo'] = (bpmnlint_plugin_exported_src_foo__WEBPACK_IMPORTED_MODULE_3___default());



cache['bpmnlint-plugin-exported/foo-absolute'] = (bpmnlint_plugin_exported_src_foo__WEBPACK_IMPORTED_MODULE_3___default());

/***/ }),

/***/ "./node_modules/bpmnlint-plugin-exported/src/foo.js":
/*!**********************************************************!*\
  !*** ./node_modules/bpmnlint-plugin-exported/src/foo.js ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = function foo() {
  return {
    check() {}
  };
};

/***/ }),

/***/ "./node_modules/bpmnlint/rules/end-event-required.js":
/*!***********************************************************!*\
  !*** ./node_modules/bpmnlint/rules/end-event-required.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  is,
  isAny
} = __webpack_require__(/*! bpmnlint-utils */ "./node_modules/bpmnlint-utils/dist/index.esm.js");


/**
 * A rule that checks the presence of an end event per scope.
 */
module.exports = function() {

  function hasEndEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'bpmn:EndEvent'))
    );
  }

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Process',
      'bpmn:SubProcess'
    ])) {
      return;
    }

    if (!hasEndEvent(node)) {
      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, type + ' is missing end event');
    }
  }

  return { check };
};


/***/ }),

/***/ "./node_modules/bpmnlint/rules/label-required.js":
/*!*******************************************************!*\
  !*** ./node_modules/bpmnlint/rules/label-required.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  is,
  isAny
} = __webpack_require__(/*! bpmnlint-utils */ "./node_modules/bpmnlint-utils/dist/index.esm.js");


/**
 * A rule that checks the presence of a label.
 */
module.exports = function() {

  function check(node, reporter) {

    if (isAny(node, [
      'bpmn:ParallelGateway',
      'bpmn:EventBasedGateway'
    ])) {
      return;
    }

    // ignore joining gateways
    if (is(node, 'bpmn:Gateway') && !isForking(node)) {
      return;
    }

    if (is(node, 'bpmn:BoundaryEvent')) {
      return;
    }

    // ignore sub-processes
    if (is(node, 'bpmn:SubProcess')) {

      // TODO(nikku): better ignore expanded sub-processes only
      return;
    }

    // ignore sequence flow without condition
    if (is(node, 'bpmn:SequenceFlow') && !hasCondition(node)) {
      return;
    }

    // ignore data objects and artifacts for now
    if (isAny(node, [
      'bpmn:FlowNode',
      'bpmn:SequenceFlow',
      'bpmn:Participant',
      'bpmn:Lane'
    ])) {

      const name = (node.name || '').trim();

      if (name.length === 0) {
        reporter.report(node.id, 'Element is missing label/name', [ 'name' ]);
      }
    }
  }

  return { check };
};


// helpers ////////////////////////

function isForking(node) {
  const outgoing = node.outgoing || [];

  return outgoing.length > 1;
}

function hasCondition(node) {
  return node.conditionExpression;
}

/***/ }),

/***/ "./node_modules/bpmnlint/rules/start-event-required.js":
/*!*************************************************************!*\
  !*** ./node_modules/bpmnlint/rules/start-event-required.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  is,
  isAny
} = __webpack_require__(/*! bpmnlint-utils */ "./node_modules/bpmnlint-utils/dist/index.esm.js");


/**
 * A rule that checks for the presence of a start event per scope.
 */
module.exports = function() {

  function hasStartEvent(node) {
    const flowElements = node.flowElements || [];

    return (
      flowElements.some(node => is(node, 'bpmn:StartEvent'))
    );
  }

  function check(node, reporter) {

    if (!isAny(node, [
      'bpmn:Process',
      'bpmn:SubProcess'
    ])) {
      return;
    }

    if (!hasStartEvent(node)) {
      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, type + ' is missing start event');
    }
  }

  return { check };
};


/***/ }),

/***/ "./node_modules/bpmnlint-utils/dist/index.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/bpmnlint-utils/dist/index.esm.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   is: () => (/* binding */ is),
/* harmony export */   isAny: () => (/* binding */ isAny)
/* harmony export */ });
/**
 * Checks whether node is of specific bpmn type.
 *
 * @param {ModdleElement} node
 * @param {String} type
 *
 * @return {Boolean}
 */
function is(node, type) {

  if (type.indexOf(':') === -1) {
    type = 'bpmn:' + type;
  }

  return (
    (typeof node.$instanceOf === 'function')
      ? node.$instanceOf(type)
      : node.$type === type
  );
}

/**
 * Checks whether node has any of the specified types.
 *
 * @param {ModdleElement} node
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
function isAny(node, types) {
  return types.some(function(type) {
    return is(node, type);
  });
}


//# sourceMappingURL=index.esm.js.map


/***/ })

/******/   });
/************************************************************************/
/******/   // The module cache
/******/   var __webpack_module_cache__ = {};
/******/   
/******/   // The require function
/******/   function __webpack_require__(moduleId) {
/******/     // Check if module is in cache
/******/     var cachedModule = __webpack_module_cache__[moduleId];
/******/     if (cachedModule !== undefined) {
/******/       return cachedModule.exports;
/******/     }
/******/     // Create a new module (and put it into the cache)
/******/     var module = __webpack_module_cache__[moduleId] = {
/******/       // no module.id needed
/******/       // no module.loaded needed
/******/       exports: {}
/******/     };
/******/   
/******/     // Execute the module function
/******/     __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/   
/******/     // Return the exports of the module
/******/     return module.exports;
/******/   }
/******/   
/************************************************************************/
/******/   /* webpack/runtime/compat get default export */
/******/   (() => {
/******/     // getDefaultExport function for compatibility with non-harmony modules
/******/     __webpack_require__.n = (module) => {
/******/       var getter = module && module.__esModule ?
/******/         () => (module['default']) :
/******/         () => (module);
/******/       __webpack_require__.d(getter, { a: getter });
/******/       return getter;
/******/     };
/******/   })();
/******/   
/******/   /* webpack/runtime/define property getters */
/******/   (() => {
/******/     // define getter functions for harmony exports
/******/     __webpack_require__.d = (exports, definition) => {
/******/       for(var key in definition) {
/******/         if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/           Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/         }
/******/       }
/******/     };
/******/   })();
/******/   
/******/   /* webpack/runtime/hasOwnProperty shorthand */
/******/   (() => {
/******/     __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/   })();
/******/   
/******/   /* webpack/runtime/make namespace object */
/******/   (() => {
/******/     // define __esModule on exports
/******/     __webpack_require__.r = (exports) => {
/******/       if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/         Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/       }
/******/       Object.defineProperty(exports, '__esModule', { value: true });
/******/     };
/******/   })();
/******/   
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bpmnlintrc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./.bpmnlintrc */ "./src/.bpmnlintrc");


console.log(_bpmnlintrc__WEBPACK_IMPORTED_MODULE_0__["default"]);
})();

/******/ })()
;