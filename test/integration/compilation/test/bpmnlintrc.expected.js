
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
  "ad-hoc-sub-process": "error",
  "conditional-flows": "error",
  "end-event-required": "error",
  "event-sub-process-typed-start-event": "error",
  "fake-join": "warn",
  "global": "warn",
  "label-required": "error",
  "link-event": "error",
  "no-bpmndi": "error",
  "no-complex-gateway": "error",
  "no-disconnected": "warn",
  "no-duplicate-sequence-flows": "error",
  "no-gateway-join-fork": "error",
  "no-implicit-split": "error",
  "no-implicit-end": "error",
  "no-implicit-start": "error",
  "no-inclusive-gateway": "error",
  "no-overlapping-elements": "warn",
  "single-blank-start-event": "error",
  "single-event-definition": "error",
  "start-event-required": "error",
  "sub-process-blank-start-event": "error",
  "superfluous-gateway": "warn",
  "superfluous-termination": "warn",
  "test/no-label-foo": "error",
  "exported/foo": "error",
  "exported/bar": "error",
  "exported/baz": "error",
  "exported/foo-absolute": "error"
};

const config = {
  rules: rules
};

const bundle = {
  resolver: resolver,
  config: config
};

export { resolver, config };

export default bundle;

import rule_0 from 'bpmnlint/rules/ad-hoc-sub-process';

cache['bpmnlint/ad-hoc-sub-process'] = rule_0;

import rule_1 from 'bpmnlint/rules/conditional-flows';

cache['bpmnlint/conditional-flows'] = rule_1;

import rule_2 from 'bpmnlint/rules/end-event-required';

cache['bpmnlint/end-event-required'] = rule_2;

import rule_3 from 'bpmnlint/rules/event-sub-process-typed-start-event';

cache['bpmnlint/event-sub-process-typed-start-event'] = rule_3;

import rule_4 from 'bpmnlint/rules/fake-join';

cache['bpmnlint/fake-join'] = rule_4;

import rule_5 from 'bpmnlint/rules/global';

cache['bpmnlint/global'] = rule_5;

import rule_6 from 'bpmnlint/rules/label-required';

cache['bpmnlint/label-required'] = rule_6;

import rule_7 from 'bpmnlint/rules/link-event';

cache['bpmnlint/link-event'] = rule_7;

import rule_8 from 'bpmnlint/rules/no-bpmndi';

cache['bpmnlint/no-bpmndi'] = rule_8;

import rule_9 from 'bpmnlint/rules/no-complex-gateway';

cache['bpmnlint/no-complex-gateway'] = rule_9;

import rule_10 from 'bpmnlint/rules/no-disconnected';

cache['bpmnlint/no-disconnected'] = rule_10;

import rule_11 from 'bpmnlint/rules/no-duplicate-sequence-flows';

cache['bpmnlint/no-duplicate-sequence-flows'] = rule_11;

import rule_12 from 'bpmnlint/rules/no-gateway-join-fork';

cache['bpmnlint/no-gateway-join-fork'] = rule_12;

import rule_13 from 'bpmnlint/rules/no-implicit-split';

cache['bpmnlint/no-implicit-split'] = rule_13;

import rule_14 from 'bpmnlint/rules/no-implicit-end';

cache['bpmnlint/no-implicit-end'] = rule_14;

import rule_15 from 'bpmnlint/rules/no-implicit-start';

cache['bpmnlint/no-implicit-start'] = rule_15;

import rule_16 from 'bpmnlint/rules/no-inclusive-gateway';

cache['bpmnlint/no-inclusive-gateway'] = rule_16;

import rule_17 from 'bpmnlint/rules/no-overlapping-elements';

cache['bpmnlint/no-overlapping-elements'] = rule_17;

import rule_18 from 'bpmnlint/rules/single-blank-start-event';

cache['bpmnlint/single-blank-start-event'] = rule_18;

import rule_19 from 'bpmnlint/rules/single-event-definition';

cache['bpmnlint/single-event-definition'] = rule_19;

import rule_20 from 'bpmnlint/rules/start-event-required';

cache['bpmnlint/start-event-required'] = rule_20;

import rule_21 from 'bpmnlint/rules/sub-process-blank-start-event';

cache['bpmnlint/sub-process-blank-start-event'] = rule_21;

import rule_22 from 'bpmnlint/rules/superfluous-gateway';

cache['bpmnlint/superfluous-gateway'] = rule_22;

import rule_23 from 'bpmnlint/rules/superfluous-termination';

cache['bpmnlint/superfluous-termination'] = rule_23;

import rule_24 from 'bpmnlint-plugin-test/rules/no-label-foo';

cache['bpmnlint-plugin-test/no-label-foo'] = rule_24;

import rule_25 from 'bpmnlint-plugin-exported/src/foo';

cache['bpmnlint-plugin-exported/foo'] = rule_25;

import rule_26 from 'bpmnlint-plugin-exported/src/bar';

cache['bpmnlint-plugin-exported/bar'] = rule_26;

import rule_27 from 'bpmnlint-plugin-exported/rules/baz';

cache['bpmnlint-plugin-exported/baz'] = rule_27;

import rule_28 from 'bpmnlint-plugin-exported/src/foo';

cache['bpmnlint-plugin-exported/foo-absolute'] = rule_28;