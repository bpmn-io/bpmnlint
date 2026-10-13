module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'no-label-bar': 'error',
        'bpmnlint/label-required': 'off'
      }
    }
  }
};