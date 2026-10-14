#!/usr/bin/env node

const FooModdle = require('../lib/moddle');

const { createCli } = require('../../../../lib/cli');

createCli({
  product: require('../lib/product'),
  version: require('../package.json').version,
  Linter: require('../lib/linter'),
  NodeResolver: require('../lib/resolver/node-resolver'),
  createModdle: (extensions) => new FooModdle(extensions),
  fileType: 'foo',
  help: 'Usage: foolint diagram.foo\n',
  docsUrl: 'https://example.com/foolint#configuration'
}).run();
