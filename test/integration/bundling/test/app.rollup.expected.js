(function () {
  'use strict';

  function getDefaultExportFromCjs (x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a () {
        if (this instanceof a) {
          var args = [null];
          args.push.apply(args, arguments);
          var Ctor = Function.bind.apply(f, args);
          return new Ctor();
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, '__esModule', {value: true});
    Object.keys(n).forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function () {
          return n[k];
        }
      });
    });
    return a;
  }

  /**
   * Checks whether node is of specific bpmn type.
   *
   * @param {ModdleElement} node
   * @param {String} type
   *
   * @return {Boolean}
   */
  function is$3(node, type) {

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
  function isAny$3(node, types) {
    return types.some(function(type) {
      return is$3(node, type);
    });
  }

  var index_esm = /*#__PURE__*/Object.freeze({
    __proto__: null,
    is: is$3,
    isAny: isAny$3
  });

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(index_esm);

  const {
    is: is$2,
    isAny: isAny$2
  } = require$$0;


  /**
   * A rule that checks the presence of a label.
   */
  var labelRequired = function() {

    function check(node, reporter) {

      if (isAny$2(node, [
        'bpmn:ParallelGateway',
        'bpmn:EventBasedGateway'
      ])) {
        return;
      }

      // ignore joining gateways
      if (is$2(node, 'bpmn:Gateway') && !isForking(node)) {
        return;
      }

      if (is$2(node, 'bpmn:BoundaryEvent')) {
        return;
      }

      // ignore sub-processes
      if (is$2(node, 'bpmn:SubProcess')) {

        // TODO(nikku): better ignore expanded sub-processes only
        return;
      }

      // ignore sequence flow without condition
      if (is$2(node, 'bpmn:SequenceFlow') && !hasCondition(node)) {
        return;
      }

      // ignore data objects and artifacts for now
      if (isAny$2(node, [
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

  var rule_0 = /*@__PURE__*/getDefaultExportFromCjs(labelRequired);

  const {
    is: is$1,
    isAny: isAny$1
  } = require$$0;


  /**
   * A rule that checks for the presence of a start event per scope.
   */
  var startEventRequired = function() {

    function hasStartEvent(node) {
      const flowElements = node.flowElements || [];

      return (
        flowElements.some(node => is$1(node, 'bpmn:StartEvent'))
      );
    }

    function check(node, reporter) {

      if (!isAny$1(node, [
        'bpmn:Process',
        'bpmn:SubProcess'
      ])) {
        return;
      }

      if (!hasStartEvent(node)) {
        const type = is$1(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

        reporter.report(node.id, type + ' is missing start event');
      }
    }

    return { check };
  };

  var rule_1 = /*@__PURE__*/getDefaultExportFromCjs(startEventRequired);

  const {
    is,
    isAny
  } = require$$0;


  /**
   * A rule that checks the presence of an end event per scope.
   */
  var endEventRequired = function() {

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

  var rule_2 = /*@__PURE__*/getDefaultExportFromCjs(endEventRequired);

  var foo = function foo() {
    return {
      check() {}
    };
  };

  var rule_4 = /*@__PURE__*/getDefaultExportFromCjs(foo);

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

  cache['bpmnlint/label-required'] = rule_0;

  cache['bpmnlint/start-event-required'] = rule_1;

  cache['bpmnlint/end-event-required'] = rule_2;

  cache['bpmnlint-plugin-exported/foo'] = rule_4;

  cache['bpmnlint-plugin-exported/foo-absolute'] = rule_4;

  console.log(bundle);

})();
