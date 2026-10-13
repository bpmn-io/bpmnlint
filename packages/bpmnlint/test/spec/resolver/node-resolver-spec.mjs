import NodeResolver from '../../../lib/resolver/node-resolver.js';

import {
  expect
} from '../../helper.mjs';


describe('resolver/node-resolver', function() {

  describe('#resolveRule', function() {

    const resolver = createResolver(
      createRequire(
        function __require(path) {

          // mock local package.json resolving
          if (path === './package.json') {
            return {
              name: 'bpmnlint-plugin-local'
            };
          }

          /**
           * Resolve local plugin rules.
           */

          // mock resolving of exported rules ($PKG.rules[$NAME])
          if (path === '.') {
            return {
              rules: {
                'exported-invalid': () => {},
                'exported-path': './rules/exported-path',
                'exported-external-path': 'some-external-library'
              }
            };
          }

          if (path === 'ROOT/bpmnlint-plugin-local/lib/rules/exported-path') {
            return {
              path
            };
          }

          // mock resolving of non-exported rules ($PKG/rules/$NAME)
          if (path === './rules/non-exported') {
            return {
              path
            };
          }

          if (path === 'some-external-library') {
            return {
              path
            };
          }

          /**
           * Resolve foreign plugin rules.
           */

          // mock resolving of exported rules ($PKG.rules[$NAME])
          if (path === 'bpmnlint-plugin-foreign') {
            return {
              rules: {
                'exported-invalid': () => {},
                'exported-path': './rules/exported-path',
                'exported-external-path': 'some-external-library'
              }
            };
          }

          if (path === 'bpmnlint-plugin-foreign/lib/rules/exported-path') {
            return {
              path
            };
          }

          // mock resolving of non-exported rules ($PKG/rules/$NAME)
          if (path === 'bpmnlint-plugin-foreign/rules/non-exported') {
            return {
              path
            };
          }

          if (path === 'ROOT/bpmnlint-plugin-foreign/lib/rules/exported-path') {
            return {
              path
            };
          }

          throw new Error('not found: ' + path);
        },
        function __resolve(path) {

          if (path === '.') {
            return 'ROOT/bpmnlint-plugin-local/lib/index.js';
          }

          if (path === 'bpmnlint-plugin-foreign') {
            return 'ROOT/bpmnlint-plugin-foreign/lib/index.js';
          }

          throw new Error('not found: ' + path);
        }
      ), createRequire(
        function __require(path) {

          /**
           * Resolve built-in rules.
           */

          // mock resolving local
          if (path === '../../rules/label-required') {
            return {
              path
            };
          }

          throw new Error('not found: ' + path);
        },
        function __resolve(path) {
          throw new Error('not found: ' + path);
        }
      )
    );


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
          err = e;
        }

        // then
        expect(err).to.exist;
        expect(err.message).to.eql('cannot resolve rule <non-existing> from <bpmnlint>');
      });

    });


    describe('plugin - foreign', function() {

      describe('should resolve', function() {

        describe('via custom path (exported through $PKG.rules[$NAME])', function() {

          it('relative resolution', async function() {

            // when
            const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-foreign', 'exported-path');

            // then
            expect(resolvedRule).to.eql({
              path: 'ROOT/bpmnlint-plugin-foreign/lib/rules/exported-path'
            });
          });


          it('absolute resolution', async function() {

            // when
            const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-foreign', 'exported-external-path');

            // then
            expect(resolvedRule).to.eql({
              path: 'some-external-library'
            });
          });

        });


        it('via default location ($PKG/rules/$NAME)', async function() {

          // when
          const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-foreign', 'non-exported');

          // then
          expect(resolvedRule).to.eql({
            path: 'bpmnlint-plugin-foreign/rules/non-exported'
          });
        });

      });


      describe('should fail to resolve', function() {

        it('handling non-existing rule', async function() {

          let err;

          // when
          try {
            await resolver.resolveRule('bpmnlint-plugin-foreign', 'non-existing');
          } catch (e) {

            err = e;
          }

          // then
          expect(err).to.exist;
          expect(err.message).to.eql('cannot resolve rule <non-existing> from <bpmnlint-plugin-foreign>');
        });


        it('handling non-existing plugin', async function() {

          let err;

          // when
          try {
            await resolver.resolveRule('bpmnlint-plugin-non-existing', 'exported');
          } catch (e) {

            err = e;
          }

          // then
          expect(err).to.exist;
          expect(err.message).to.eql('cannot resolve rule <exported> from <bpmnlint-plugin-non-existing>');
        });


        it('handling illegal $PKG.rules[$NAME] export', async function() {

          let err;

          // when
          try {
            await resolver.resolveRule('bpmnlint-plugin-foreign', 'exported-invalid');
          } catch (e) {
            err = e;
          }

          // then
          expect(err).to.exist;
          expect(err.message).to.eql(
            'cannot resolve rule <exported-invalid> from <bpmnlint-plugin-foreign>: illegal rule export (expected path reference)'
          );
        });

      });

    });


    describe('plugin - local', function() {

      describe('should resolve', function() {

        describe('via custom path (exported through $PKG.rules[$NAME])', function() {

          it('relative resolution', async function() {

            // when
            const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-local', 'exported-path');

            // then
            expect(resolvedRule).to.eql({
              path: 'ROOT/bpmnlint-plugin-local/lib/rules/exported-path'
            });
          });


          it('absolute resolution', async function() {

            // when
            const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-local', 'exported-external-path');

            // then
            expect(resolvedRule).to.eql({
              path: 'some-external-library'
            });
          });

        });


        it('via default location ($PKG/rules/$NAME)', async function() {

          // when
          const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-local', 'non-exported');

          // then
          expect(resolvedRule).to.eql({
            path: './rules/non-exported'
          });
        });

      });


      describe('should fail to resolve', function() {

        it('handling non-existing rule', async function() {

          let err;

          // when
          try {
            await resolver.resolveRule('bpmnlint-plugin-local', 'non-existing');
          } catch (e) {

            err = e;
          }

          // then
          expect(err).to.exist;
          expect(err.message).to.eql('cannot resolve rule <non-existing> from <bpmnlint-plugin-local>');
        });


        it('handling illegal $PKG.rules[$NAME] export', async function() {

          let err;

          // when
          try {
            await resolver.resolveRule('bpmnlint-plugin-local', 'exported-invalid');
          } catch (e) {
            err = e;
          }

          // then
          expect(err).to.exist;
          expect(err.message).to.eql(
            'cannot resolve rule <exported-invalid> from <bpmnlint-plugin-local>: illegal rule export (expected path reference)'
          );
        });

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

      throw new Error('not found: ' + path);
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

      throw new Error('not found: ' + path);
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
          err = e;
        }

        // then
        expect(err).to.exist;
        expect(err.message).to.eql('cannot resolve config <non-existing> from <bpmnlint>');
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
          expect(e.message).to.eql('cannot resolve config <exported> from <bpmnlint-plugin-non-existing>');

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
          expect(e.message).to.eql('cannot resolve config <non-existing> from <bpmnlint-plugin-foreign>');

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
          expect(e.message).to.eql('cannot resolve config <non-existing> from <bpmnlint-plugin-local>');

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

function createRequire(require, resolve) {
  return Object.assign(require, { resolve });
}