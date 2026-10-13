module.exports = {
  configs: {
    recommended: {
      rules: {
        'foo': 'error',
        'bar': 'error',
        'baz': 'error',
        'foo-absolute': 'error'
      }
    }
  },
  rules: {
    'foo': './foo',
    'bar': './bar',
    'foo-absolute': 'bpmnlint-plugin-exported/src/foo'
  }
};