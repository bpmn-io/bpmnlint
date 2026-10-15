#!/usr/bin/env node

// @ts-expect-error 'missing <bpmn-moddle> types'
const { BpmnModdle } = require('bpmn-moddle');

const { createCli } = require('@bpmn-io/lint-core/lib/cli');

const HELP_STRING = `
Usage
    $ bpmnlint diagram.bpmn

  Options
    --config, -c    Path to configuration file. It overrides .bpmnlintrc if present
    --init          Generate a .bpmnlintrc file in the current working directory
    --max-warnings  Number of warnings to trigger nonzero exit code - default: -1

  Examples
    $ bpmnlint ./invoice.bpmn
    $ bpmnlint --max-warnings=0 '*.bpmn'
    $ bpmnlint --init

`;

createCli({
  product: require('../lib/product'),
  version: require('../package.json').version,
  Linter: require('../lib/linter'),
  NodeResolver: require('../lib/resolver/node-resolver'),
  createModdle: (extensions) => new BpmnModdle(extensions),
  fileType: 'bpmn',
  help: HELP_STRING,
  docsUrl: 'https://github.com/bpmn-io/bpmnlint#configuration'
}).run();
