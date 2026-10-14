import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

import { expect, stubCJS } from '../helper.mjs';

const {
  __dirname,
  require
} = stubCJS(import.meta.url);

const root = join(__dirname, '../..');

const pkg = require('../../package.json');


describe('exports', function() {

  /**
   * Public API of the package, as used by plugins, bundler
   * plugins and applications. Every module is available
   * with and without <.js> extension.
   */
  const MODULES = {
    'lib/linter': { default: 'function' },
    'lib/resolver/node-resolver': { default: 'function' },
    'lib/resolver/static-resolver': { default: 'function' },
    'lib/support/compile-config': { default: 'function' },
    'lib/testers/rule-tester': { named: [ 'expectEqual', 'verify', 'getTitle', 'replacer' ] },
    'lib/testers/helper': { named: [ 'createModdle', 'readModdle' ] }
  };


  describe('should resolve', function() {

    it('main entry', async function() {

      // when
      const { Linter } = await import('bpmnlint');

      // then
      expect(Linter).to.be.a('function');
      expect(require('bpmnlint').Linter).to.equal(Linter);
    });


    Object.entries(MODULES).forEach(([ module, { default: type, named } ]) => {

      [ module, `${ module }.js` ].forEach(specifier => {

        it(`bpmnlint/${ specifier }`, async function() {

          // when
          const esm = await import(`bpmnlint/${ specifier }`);
          const cjs = require(`bpmnlint/${ specifier }`);

          // then
          if (type) {
            expect(esm.default).to.be.a(type);
            expect(esm.default).to.equal(cjs);
          }

          if (named) {
            expect(Object.keys(esm).filter(key => key !== 'default' && key !== 'module.exports').sort()).to.eql([ ...named ].sort());

            named.forEach(key => expect(esm[key]).to.equal(cjs[key]));
          }
        });

      });

    });


    describe('rules', function() {

      const rules = readdirSync(join(root, 'rules')).filter(file => file !== 'helper.js').map(file => file.replace(/\.js$/, ''));

      it('should find rules', function() {
        expect(rules).to.have.length.above(20);
      });

      rules.forEach(rule => {

        it(`bpmnlint/rules/${ rule }`, function() {

          expect(require(`bpmnlint/rules/${ rule }`)).to.equal(require(`bpmnlint/rules/${ rule }.js`));
          expect(require(`bpmnlint/rules/${ rule }`)).to.be.a('function');
        });

      });

    });


    describe('configs', function() {

      [ 'all', 'recommended', 'correctness' ].forEach(config => {

        it(`bpmnlint/config/${ config }`, function() {

          expect(require(`bpmnlint/config/${ config }`)).to.equal(require(`bpmnlint/config/${ config }.js`));
          expect(require(`bpmnlint/config/${ config }`).rules).to.exist;
        });

      });

    });


    it('package.json', function() {

      expect(require('bpmnlint/package.json').name).to.eql('bpmnlint');
    });

  });


  describe('should NOT expose', function() {

    [
      'bpmnlint/lib/index',
      'bpmnlint/lib/index.js',
      'bpmnlint/lib/product',
      'bpmnlint/lib/test-rule',
      'bpmnlint/lib/traverse',
      'bpmnlint/lib/resolver/helper',
      'bpmnlint/rules/helper',
      'bpmnlint/rules/helper.js',
      'bpmnlint/bin/bpmnlint.js'
    ].forEach(specifier => {

      it(specifier, function() {

        expect(() => require.resolve(specifier)).to.throw().with.property('code', 'ERR_PACKAGE_PATH_NOT_EXPORTED');
      });

    });

  });


  it('should expose <lib/types> to TypeScript only', function() {

    // type declarations only, cf. <types> below
    expect(pkg.exports['./lib/types']).to.eql({ types: './lib/types.d.ts' });

    expect(() => require.resolve('bpmnlint/lib/types')).to.throw().with.property('code', 'ERR_PACKAGE_PATH_NOT_EXPORTED');
  });


  it('should point to existing files', function() {

    // when
    const missing = Object.entries(pkg.exports).flatMap(([ key, value ]) => {

      const targets = value === null ? [] : (
        typeof value === 'string' ? [ value ] : Object.values(value)
      );

      return targets
        .filter(target => !target.includes('*') && !existsSync(join(root, target)))
        .map(target => `${ key } -> ${ target }`);
    });

    // then
    expect(missing).to.eql([]);
  });


  describe('types', function() {

    // consumers use different module resolution strategies
    [ 'bundler', 'node16', 'node10' ].forEach(strategy => {

      it(`should resolve with <${ strategy }>`, function() {

        this.timeout(60000);

        // when
        const run = () => execFileSync(
          process.execPath,
          [
            require.resolve('typescript/bin/tsc'),
            '-p',
            join(__dirname, 'types', `tsconfig.${ strategy }.json`)
          ],
          { encoding: 'utf8' }
        );

        // then
        expect(run).not.to.throw();
      });

    });

  });

});
