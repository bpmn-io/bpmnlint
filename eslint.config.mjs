import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  lib: [
    'packages/*/lib/**/*.js',
    'packages/*/rules/**/*.js',
    'packages/*/config/**/*.js'
  ],
  test: [
    'packages/*/test/**/*.js',
    'packages/*/test/**/*.mjs'
  ],
  ignored: [
    '**/coverage',
    '**/.nyc_output',
    'packages/bpmnlint/test/integration/bundling/dist',
    'packages/bpmnlint/test/integration/bundling/test',
    'packages/bpmnlint/test/integration/compilation/test'
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
