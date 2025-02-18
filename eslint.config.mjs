import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  lib: [
    'lib/**/*.js',
    'rules/**/*.js',
    'config/**/*.js'
  ],
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

  // lib
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      files: files.lib,
      languageOptions: {
        ...config.languageOptions,
        sourceType: 'commonjs'
      }
    };
  }),

  // build + test
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: files.lib,
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  })
];
