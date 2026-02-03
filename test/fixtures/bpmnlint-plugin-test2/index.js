module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'no-label-xxx': 'error',
        'bpmnlint/no-disconnected': 'warn'
      }
    }
  }
};