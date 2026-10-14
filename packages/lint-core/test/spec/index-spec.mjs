import core from '../../lib/index.js';

import { execFileSync } from 'node:child_process';

import { expect, stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


describe('index', function() {

  it('should export API', function() {

    expect(Object.keys(core).sort()).to.eql([
      'StaticResolver',
      'createLinter',
      'testRule',
      'traverse'
    ]);
  });


  it('should be browser-safe', function() {

    // given
    // load all entry points that end up in browser bundles
    // (this includes the rules of a product) and record
    // everything they pull in
    const script = `
      const Module = require('node:module');

      const requested = [];

      const _require = Module.prototype.require;

      Module.prototype.require = function(id) {
        requested.push(id);

        return _require.apply(this, arguments);
      };

      require(${ JSON.stringify(__dirname + '/../../lib/index.js') });

      console.log(JSON.stringify(requested));
    `;

    // when
    const requested = JSON.parse(execFileSync(process.execPath, [ '-e', script ], {
      encoding: 'utf8'
    }));

    // then
    const nodeSpecific = requested.filter(id => (
      id.startsWith('node:') ||
      [ 'fs', 'path', 'assert', 'module', 'process', 'mri', 'tiny-glob', 'cli-table', 'ansi-colors' ].includes(id)
    ));

    expect(nodeSpecific).to.eql([]);
  });

});
