const allRules = [
  'label-required',
  'no-duplicate-requirements'
];


module.exports = {
  rules: allRules.reduce(function(rules, ruleName) {
    rules[ruleName] = 'error';

    return rules;
  }, {})
};