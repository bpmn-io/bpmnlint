import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  test: [
    'test/**/*.js',
    'test/**/*.mjs'
  ],
  ignored: [
    'coverage',
    '.nyc_output',
    'test/integration/bundling/dist',
    'test/integration/bundling/test',
    'test/integration/compilation/test'
  ]
};

export default [
  {
    'ignores': files.ignored
  },

  // lib + test
  ...bpmnIoPlugin.configs.node,

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  })
];