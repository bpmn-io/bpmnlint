module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'test/no-label-foo': 'error',
        'bpmnlint/no-disconnected': 'warn'
      }
    }
  }
};