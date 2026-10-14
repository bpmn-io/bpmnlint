#!/usr/bin/env node

const { DmnModdle } = require('dmn-moddle');

const { createCli } = require('@bpmn-io/lint-core/lib/cli');

const HELP_STRING = `
Usage
    $ dmnlint diagram.dmn

  Options
    --config, -c    Path to configuration file. It overrides .dmnlintrc if present
    --init          Generate a .dmnlintrc file in the current working directory
    --max-warnings  Number of warnings to trigger nonzero exit code - default: -1

  Examples
    $ dmnlint ./invoice.dmn
    $ dmnlint --max-warnings=0 '*.dmn'
    $ dmnlint --init

`;

createCli({
  product: require('../lib/product'),
  version: require('../package.json').version,
  Linter: require('../lib/linter'),
  NodeResolver: require('../lib/resolver/node-resolver'),
  createModdle: (extensions) => new DmnModdle(extensions),
  fileType: 'dmn',
  help: HELP_STRING,
  docsUrl: 'https://github.com/bpmn-io/bpmnlint/tree/main/packages/dmnlint#configuration'
}).run();
