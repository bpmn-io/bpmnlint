module.exports = {
  configs: {
    recommended: {
      extends: 'dmnlint:recommended',
      rules: {
        'no-label-xxx': 'error',
        'dmnlint/label-required': 'warn'
      }
    }
  }
};