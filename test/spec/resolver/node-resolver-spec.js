import NodeResolver from '../../../lib/resolver/node-resolver';

import {
  expect
} from '../../helper';


describe('resolver/node-resolver', function() {

  describe('#resolveRule', function() {

    const resolver = createResolver(function(path) {

      // mock local package.json resolving
      if (path === './package.json') {
        return {
          name: 'bpmnlint-plugin-local'
        };
      }

      /**
       * Resolve local plugin rules.
       */

      // mock resolving of rules ($PKG/rules/$NAME)
      if (path === './rules/rule') {
        return {
          path
        };
      }

      /**
       * Resolve foreign plugin rules.
       */

      // mock resolving of rules ($PKG/rules/$NAME)
      if (path === 'bpmnlint-plugin-foreign/rules/rule') {
        return {
          path
        };
      }

      throw new Error('not found');
    }, function(path) {

      /**
       * Resolve built-in rules.
       */

      // mock resolving local
      if (path === '../../rules/label-required') {
        return {
          path
        };
      }

      throw new Error('not found');
    });


    describe('built-in', function() {

      it('should resolve', async function() {

        // when
        const resolvedRule = await resolver.resolveRule('bpmnlint', 'label-required');

        // then
        expect(resolvedRule).to.eql({
          path: '../../rules/label-required'
        });
      });


      it('should fail to resolve', async function() {

        let err;

        // when
        try {
          await resolver.resolveRule('bpmnlint', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve rule <non-existing> from <bpmnlint>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });


    describe('plugin - foreign', function() {

      it('should resolve ($PKG/rules/$NAME)', async function() {

        // when
        const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-foreign', 'rule');

        // then
        expect(resolvedRule).to.eql({
          path: 'bpmnlint-plugin-foreign/rules/rule'
        });
      });


      it('should fail to resolve (non-existing plugin)', async function() {

        let err;

        // when
        try {
          await resolver.resolveRule('bpmnlint-plugin-non-existing', 'exported');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve rule <exported> from <bpmnlint-plugin-non-existing>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });


      it('should fail to resolve (non-existing rule)', async function() {

        let err;

        // when
        try {
          await resolver.resolveRule('bpmnlint-plugin-foreign', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve rule <non-existing> from <bpmnlint-plugin-foreign>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });


    describe('plugin - local', function() {

      it('should resolve ($PKG/rules/$NAME)', async function() {

        // when
        const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-local', 'rule');

        // then
        expect(resolvedRule).to.eql({
          path: './rules/rule'
        });
      });


      it('should fail to resolve', async function() {

        let err;

        // when
        try {
          await resolver.resolveRule('bpmnlint-plugin-local', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve rule <non-existing> from <bpmnlint-plugin-local>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });

  });


  describe('#resolveConfig', function() {

    const resolver = createResolver(function(path) {

      // mock local package.json resolving
      if (path === './package.json') {
        return {
          name: 'bpmnlint-plugin-local'
        };
      }

      /**
       * Resolve local plugin configs.
       */

      // mock resolving of exported configs ($PKG.configs[$NAME])
      if (path === '.') {
        return {
          configs: {
            exported: {
              path: './lib/config/exported'
            }
          }
        };
      }

      // mock resolving of non-exported configs ($PKG/config/$NAME)
      if (path === './config/non-exported') {
        return {
          path
        };
      }

      /**
       * Resolve foreign plugin configs.
       */

      // mock resolving of exported configs ($PKG.configs[$NAME])
      if (path === 'bpmnlint-plugin-foreign') {
        return {
          configs: {
            exported: {
              path: 'bpmnlint-plugin-foreign/lib/config/exported'
            }
          }
        };
      }

      // mock resolving of non-exported configs ($PKG/config/$NAME)
      if (path === 'bpmnlint-plugin-foreign/config/non-exported') {
        return {
          path
        };
      }

      throw new Error('not found');
    }, function(path) {

      /**
       * Resolve built-in configs.
       */

      // mock resolving local
      if (path === '../../config/all' || path === '../../config/recommended') {
        return {
          path
        };
      }

      throw new Error('not found');
    });


    describe('built-in', function() {

      it('all', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint', 'all');

        // then
        expect(resolvedConfig).to.eql({
          path: '../../config/all'
        });
      });


      it('recommended', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint', 'recommended');

        // then
        expect(resolvedConfig).to.eql({
          path: '../../config/recommended'
        });
      });


      it('should fail to resolve', async function() {

        let err;

        // when
        try {
          await resolver.resolveConfig('bpmnlint', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve config <non-existing> from <bpmnlint>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });


    describe('plugin - foreign', function() {

      describe('should resolve', function() {

        it('exported ($PKG.configs[$NAME])', async function() {

          // when
          const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-foreign', 'exported');

          // then
          expect(resolvedConfig).to.eql({
            path: 'bpmnlint-plugin-foreign/lib/config/exported'
          });

        });


        it('non-exported ($PKG/config/$NAME)', async function() {

          // when
          const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-foreign', 'non-exported');

          // then
          expect(resolvedConfig).to.eql({
            path: 'bpmnlint-plugin-foreign/config/non-exported'
          });
        });

      });


      it('should fail to resolve (non-existing plugin)', async function() {

        let err;

        // when
        try {
          await resolver.resolveConfig('bpmnlint-plugin-non-existing', 'exported');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve config <exported> from <bpmnlint-plugin-non-existing>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });


      it('should fail to resolve (non-existing config)', async function() {

        let err;

        // when
        try {
          await resolver.resolveConfig('bpmnlint-plugin-foreign', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve config <non-existing> from <bpmnlint-plugin-foreign>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });


    describe('plugin - local', function() {

      describe('should resolve', function() {

        it('exported ($PKG.configs[$NAME])', async function() {

          // when
          const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-local', 'exported');

          // then
          expect(resolvedConfig).to.eql({
            path: './lib/config/exported'
          });
        });


        it('non-exported ($PKG/config/$NAME)', async function() {

          // when
          const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-local', 'non-exported');

          // then
          expect(resolvedConfig).to.eql({
            path: './config/non-exported'
          });
        });

      });


      it('should fail to resolve', async function() {

        let err;

        // when
        try {
          await resolver.resolveConfig('bpmnlint-plugin-local', 'non-existing');
        } catch (e) {

          // then
          expect(e.message).to.eql('Cannot resolve config <non-existing> from <bpmnlint-plugin-local>');

          err = e;
        }

        // verify
        expect(err).to.exist;
      });

    });

  });

});


// helpers /////////////////////////////

function createResolver(require, requireLocal) {
  return new NodeResolver({
    require,
    requireLocal
  });
}