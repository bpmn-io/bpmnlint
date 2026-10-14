import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {

  // CommonJS
  lib: [
    'packages/bpmnlint/lib/**/*.js',
    'packages/bpmnlint/rules/**/*.js',
    'packages/bpmnlint/config/**/*.js',
    'packages/dmnlint/lib/**/*.js',
    'packages/dmnlint/rules/**/*.js',
    'packages/dmnlint/config/**/*.js',
    'packages/lint-core/lib/**/*.js'
  ],

  // ES modules
  utils: [
    'packages/*-utils/lib/**/*.js'
  ],
  test: [
    'packages/*/test/**/*.js',
    'packages/*/test/**/*.mjs'
  ],
  ignored: [
    '**/coverage',
    '**/.nyc_output',
    'packages/*-utils/dist',
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

  // utils
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      files: files.utils
    };
  }),

  // build + test
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: [ ...files.lib, ...files.utils ],
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
