module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'test2/no-label-xxx': 'error',
        'bpmnlint/no-disconnected': 'warn'
      }
    }
  }
};