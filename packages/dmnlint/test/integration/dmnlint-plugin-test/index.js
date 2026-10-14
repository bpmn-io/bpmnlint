module.exports = {
  configs: {
    recommended: {
      extends: 'dmnlint:recommended',
      rules: {
        'no-label-foo': 'error',
        'dmnlint/label-required': 'warn'
      }
    }
  }
};