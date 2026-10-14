import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { expect, stubCJS } from '../helper.mjs';

const {
  __dirname,
  require
} = stubCJS(import.meta.url);

const root = join(__dirname, '../..');

const pkg = require('../../package.json');


describe('exports', function() {

  function targets(value) {

    if (typeof value === 'string') {
      return [ value ];
    }

    return Object.values(value).flatMap(targets);
  }


  it('should point to existing files', function() {

    // when
    const missing = Object.entries(pkg.exports).flatMap(([ key, value ]) => {
      return targets(value).filter(target => !existsSync(join(root, target))).map(target => `${ key } -> ${ target }`);
    });

    // then
    expect(missing).to.eql([]);
  });


  it('should expose <.js> variants', function() {

    // when
    const missing = Object.keys(pkg.exports).filter(key => {
      return key.startsWith('./lib/') && !key.endsWith('.js') && !(`${ key }.js` in pkg.exports);
    });

    // then
    expect(missing).to.eql([ './lib/types' ]);
  });


  it('should resolve exported modules', function() {

    // when
    const resolved = [
      '@bpmn-io/lint-core',
      '@bpmn-io/lint-core/lib/linter',
      '@bpmn-io/lint-core/lib/linter.js',
      '@bpmn-io/lint-core/lib/resolver/node-resolver',
      '@bpmn-io/lint-core/lib/testers/rule-tester',
      '@bpmn-io/lint-core/package.json'
    ].map(id => require.resolve(id));

    // then
    expect(resolved).to.have.length(6);
  });


  it('should NOT expose internals', function() {

    [
      '@bpmn-io/lint-core/lib/product',
      '@bpmn-io/lint-core/lib/product.js',
      '@bpmn-io/lint-core/lib/index.js'
    ].forEach(id => {

      expect(() => require.resolve(id), id).to.throw().with.property('code', 'ERR_PACKAGE_PATH_NOT_EXPORTED');
    });
  });

});
