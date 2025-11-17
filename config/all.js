const allRules = [
  'ad-hoc-sub-process',
  'conditional-flows',
  'end-event-required',
  'event-based-gateway',
  'event-sub-process-typed-start-event',
  'fake-join',
  'global',
  'label-required',
  'link-event',
  'no-bpmndi',
  'no-complex-gateway',
  'no-disconnected',
  'no-duplicate-sequence-flows',
  'no-gateway-join-fork',
  'no-implicit-end',
  'no-implicit-split',
  'no-implicit-start',
  'no-inclusive-gateway',
  'no-overlapping-elements',
  'single-blank-start-event',
  'single-event-definition',
  'start-event-required',
  'sub-process-blank-start-event',
  'superfluous-gateway',
  'superfluous-termination'
];


module.exports = {
  rules: allRules.reduce(function(rules, ruleName) {
    rules[ruleName] = 'error';

    return rules;
  }, {})
};
