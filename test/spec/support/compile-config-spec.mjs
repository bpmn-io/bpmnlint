import {
  expect
} from '../../helper.mjs';

import NodeResolver from '../../../lib/resolver/node-resolver.js';

import compileConfig from '../../../lib/support/compile-config.js';

import os from 'node:os';

import { stubCJS } from '../../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


describe('support/compile-config', function() {

  it('should import rules', async function() {

    // when
    const code = await compileConfig({
      rules: {
        'conditional-flows': 'error',
        'single-blank-start-event': 'off',
        'end-event-required': 'info',
        'no-bpmndi': 1,
        'no-implicit-split': 'warn'
      }
    });

    // then
    // imports enabled rule
    expect(code).to.contain('import rule_0 from \'bpmnlint/rules/conditional-flows\'');
    expect(code).to.contain('cache[\'bpmnlint/conditional-flows\'] = rule_0');

    expect(code).to.contain('import rule_2 from \'bpmnlint/rules/end-event-required\'');
    expect(code).to.contain('cache[\'bpmnlint/end-event-required\'] = rule_2');

    expect(code).to.contain('import rule_3 from \'bpmnlint/rules/no-bpmndi\'');
    expect(code).to.contain('cache[\'bpmnlint/no-bpmndi\'] = rule_3');

    expect(code).to.contain('import rule_4 from \'bpmnlint/rules/no-implicit-split\'');
    expect(code).to.contain('cache[\'bpmnlint/no-implicit-split\'] = rule_4');

    // does not import disabled rule
    expect(code).not.to.contain('cache[\'bpmnlint/single-blank-start-event\']');
    expect(code).not.to.contain('bpmnlint/rules/single-blank-start-event');

    // configures all rules
    expect(code).to.contain('"conditional-flows": "error"');
    expect(code).to.contain('"single-blank-start-event": 0');
    expect(code).to.contain('"end-event-required": "info"');
    expect(code).to.contain('"no-bpmndi": 1');
    expect(code).to.contain('"no-implicit-split": "warn"');

    // exports config and resolver
    expect(code).to.contain('export { resolver, config };');

    expect(code).to.contain('export default bundle;');
  });


  it('should import namespaced', async function() {

    // when
    const code = await compileConfig({
      rules: {
        '@foo/bar/rule': 'warn'
      }
    });

    // then
    expect(code).to.contain('import rule_0 from \'@foo/bpmnlint-plugin-bar/rules/rule\'');
    expect(code).to.contain('cache[\'@foo/bpmnlint-plugin-bar/rule\'] = rule_0');
  });


  describe('should import custom path rules', function() {

    it('through external source', async function() {

      // given
      const resolver = new NodeResolver({
        require: createRequire(
          function __require(path) {
            if (path === 'bpmnlint-plugin-foreign') {
              return {
                configs: {
                  recommended: {
                    rules: {
                      'exported-path': 'error',
                      'exported-external-path': 'some-rule-library'
                    }
                  }
                },
                rules: {
                  'exported-path': './rules/exported-path',
                  'exported-external-path': 'some-rule-library'
                }
              };
            }

            throw new Error('not found: ' + path);
          },
          function __resolve(path) {
            if (path === 'bpmnlint-plugin-foreign/package.json') {

              if (os.platform() === 'win32') {
                return 'C:\\\\bpmnlint-plugin-foreign\\package.json';
              } else {
                return '/bpmnlint-plugin-foreign/package.json';
              }
            }

            if (path === 'bpmnlint-plugin-foreign') {
              if (os.platform() === 'win32') {
                return 'C:\\\\bpmnlint-plugin-foreign\\lib\\index.js';
              } else {
                return '/bpmnlint-plugin-foreign/lib/index.js';
              }
            }

            throw new Error('not found: ' + path);
          }
        )
      });

      // when
      const code = await compileConfig({
        extends: 'plugin:foreign/recommended'
      }, resolver);

      // then
      expect(code).to.contain('import rule_0 from \'bpmnlint-plugin-foreign/lib/rules/exported-path\'');
      expect(code).to.contain('cache[\'bpmnlint-plugin-foreign/exported-path\'] = rule_0');

      expect(code).to.contain('import rule_1 from \'some-rule-library\'');
      expect(code).to.contain('cache[\'bpmnlint-plugin-foreign/exported-external-path\'] = rule_1');
    });


    it('through local source', async function() {

      // given
      const resolver = new NodeResolver({
        require: createRequire(
          function __require(path) {
            if (path === './package.json') {
              return {
                name: 'bpmnlint-plugin-local'
              };
            }

            if (path === '.') {
              return {
                configs: {
                  recommended: {
                    rules: {
                      'exported-path': 'error',
                      'exported-external-path': 'some-rule-library'
                    }
                  }
                },
                rules: {
                  'exported-path': './rules/exported-path',
                  'exported-external-path': 'some-rule-library'
                }
              };
            }

            throw new Error('not found: ' + path);
          },
          function __resolve(path) {
            if (path === './package.json') {
              return 'bpmnlint-plugin-local/package.json';
            }

            if (path === '.') {
              return 'bpmnlint-plugin-local/lib/index.js';
            }

            throw new Error('not found: ' + path);
          }
        )
      });

      // when
      const code = await compileConfig({
        extends: 'plugin:local/recommended'
      }, resolver);

      // then
      expect(code).to.contain('import rule_0 from \'bpmnlint-plugin-local/lib/rules/exported-path\'');
      expect(code).to.contain('cache[\'bpmnlint-plugin-local/exported-path\'] = rule_0');

      expect(code).to.contain('import rule_1 from \'some-rule-library');
      expect(code).to.contain('cache[\'bpmnlint-plugin-local/exported-external-path\'] = rule_1');
    });


    it('handling illegal path errors', async function() {

      // given
      const resolver = new NodeResolver({
        require: function(path) {
          if (path === './package.json') {
            return {
              name: 'bpmnlint-plugin-local'
            };
          }

          if (path === '.') {
            return {
              configs: {
                recommended: {
                  rules: {
                    'not-a-path': 'error'
                  }
                }
              },
              rules: {
                'not-a-path': () => {}
              }
            };
          }

          throw new Error('not found: ' + path);
        }
      });

      let err;

      // when
      try {
        await compileConfig({
          extends: 'plugin:local/recommended'
        }, resolver);
      } catch (error) {
        err = error;
      }

      // then
      expect(err).to.exist;
      expect(err.message).to.eql(
        'failed to bundle rule <not-a-path> from <.>: illegal rule export (expected path reference)'
      );
    });

  });


  it('should resolve extends', async function() {

    // when
    const code = await compileConfig({
      extends: 'bpmnlint:recommended'
    });

    // then
    // bundles enabled rules
    expect(code).to.contain('conditional-flows');
    expect(code).to.contain('single-blank-start-event');
  });

});



function createRequire(require, resolve) {
  return Object.assign(require, { resolve });
}