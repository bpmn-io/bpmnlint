module.exports = {
  configs: {
    recommended: {
      extends: 'bpmnlint:recommended',
      rules: {
        'no-label-foo': 'error'
      }
    }
  }
};