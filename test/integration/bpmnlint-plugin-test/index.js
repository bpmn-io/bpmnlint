module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'no-label-foo': 'error',
        'bpmnlint/no-disconnected': 'warn'
      }
    }
  }
};