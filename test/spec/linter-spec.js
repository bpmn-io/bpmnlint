import Linter from '../../lib/linter';

import {
  expect,
  readModdle,
  createRule
} from '../helper';

import { is } from 'bpmnlint-utils';


describe('linter', function() {

  describe('constructor', function() {

    it('should require { resolver } config', function() {

      expect(() => {
        new Linter();
      }).to.throw('must provide <options.resolver>');

    });

  });


  describe('#applyRule', function() {

    let moddleRoot;

    const linter = new Linter({
      resolver: fakeResolver()
    });


    beforeEach(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    it('should succeed', function() {

      // when
      const results = linter.applyRule(
        moddleRoot,
        {
          name: 'test-rule',
          config: { },
          rule: createRule(fakeRule),
          category: 'error'
        }
      );

      // then
      expect(results).to.eql(buildResults('error'));
    });


    it('should fail', function() {

      const failingRule = {};

      // when
      const results = linter.applyRule(
        moddleRoot,
        {
          name: 'test-rule',
          config: { },
          rule: failingRule,
          category: 'warn'
        }
      );

      // then
      expect(results).to.eql([
        {
          category: 'error',
          message: 'Rule error: rule.check is not a function'
        }
      ]);
    });


  });


  describe('#lint', function() {

    let moddleRoot;

    before(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    describe('config', function() {

      it('should apply global config', async function() {

        // given
        const resolver = {
          resolveRule() {
            throw new Error('unexpected invocation');
          }
        };

        const config = {};

        const linter = new Linter({ resolver, config });

        // when
        const lintResults = await linter.lint(moddleRoot);

        // then
        expect(lintResults).to.eql({});
      });


      it('should apply local config', async function() {

        // given
        const resolver = {
          resolveRule() {
            throw new Error('unexpected invocation');
          }
        };

        const config = {
          rules: {
            nonExistingRule: 'warn'
          }
        };

        const linter = new Linter({ resolver, config });

        // when
        const lintResults = await linter.lint(moddleRoot, {});

        // then
        expect(lintResults).to.eql({});
      });

    });


    describe('rules', function() {

      it('should resolve', async function() {

        // given
        const resolver = {
          resolveRule(pkg, ruleName) {
            expect(pkg).to.eql('bpmnlint');

            expect(ruleName).to.eql('testRule');

            return fakeRule;
          }
        };

        const linter = new Linter({ resolver });

        // when
        const lintResults = await linter.lint(moddleRoot, {
          rules: {
            testRule: 'warn'
          }
        });

        // then
        expect(lintResults).to.eql({
          testRule: buildResults('warn')
        });
      });


      it('should handle unresolved', async function() {

        // given
        const resolver = {
          resolveRule(ruleName) {
            return null;
          }
        };

        const linter = new Linter({ resolver });

        let error;

        try {
          await linter.lint(moddleRoot, {
            rules: {
              unknownRule: 'warn'
            }
          });
        } catch (e) {
          error = e;
        }

        // then
        expect(error).to.exist;

        expect(error.message).to.eql('unknown rule <unknownRule>');
      });


      it('should not resolve disabled', async function() {

        // given
        const resolver = {
          resolveRule(ruleName) {
            throw new Error('unexpected resolve call');
          }
        };

        const config = {
          rules: {
            unknownRule: 'off'
          }
        };

        const linter = new Linter({ resolver, config });

        // when
        const results = await linter.lint(moddleRoot);

        // then
        expect(results).to.eql({});
      });

    });

  });


  describe('#parseRuleValue', function() {

    it('should extract { category, config }', function() {

      // given
      const linter = new Linter({ resolver: fakeResolver() });


      // then
      expect(linter.parseRuleValue(0)).to.eql({
        category: 'off',
        config: {}
      });

      expect(linter.parseRuleValue([ 0, 'A' ])).to.eql({
        category: 'off',
        config: 'A'
      });

      expect(linter.parseRuleValue(1)).to.eql({
        category: 'warn',
        config: {}
      });

      expect(linter.parseRuleValue(2)).to.eql({
        category: 'error',
        config: {}
      });

    });

  });


  describe('#resolveConfiguredRules', function() {

    describe('should resolve extended', function() {

      it('single parent', async function() {

        // given
        const resolver = {

          resolveRule(pkg, ruleName) {
            expect(pkg).to.eql('bpmnlint');

            expect(ruleName).to.eql('foo');

            return { check() { } };
          },

          resolveConfig(pkg, configName) {
            expect(pkg).to.eql('bpmnlint');

            expect(configName).to.eql('recommended');

            return {
              rules: {
                foo: 'warn'
              }
            };
          }

        };

        const linter = new Linter({ resolver });

        const config = {
          extends: 'bpmnlint:recommended'
        };

        // when
        const rules = await linter.resolveConfiguredRules(config);

        // then
        expect(rules).to.eql({
          'foo': 'warn'
        });
      });


      describe('multiple parents', function() {

        // given
        const resolver = {

          resolveRule(pkg, ruleName) {
            return { check() { } };
          },

          resolveConfig(pkg, configName) {

            if (pkg === 'bpmnlint' && configName === 'recommended') {
              return {
                rules: {
                  'foo': 'warn',
                  'bar': 'warn'
                }
              };
            }

            if (pkg === 'bpmnlint-plugin-test') {
              if (configName === 'recommended') {
                return {
                  extends: 'plugin:test/base',
                  rules: {
                    'test/bar': 'warn',
                    'other': 'warn'
                  }
                };
              }

              if (configName === 'base') {
                return {
                  rules: {
                    'bpmnlint/bar': 'error',
                    'bar': 'error',
                    'other': 'error'
                  }
                };
              }
            }

            if (pkg === '@ns/bpmnlint-plugin-test2') {
              if (configName === 'recommended') {
                return {
                  rules: {
                    'bar': 'off',
                  }
                };
              }
            }

            throw new Error(`unexpected config <${configName}>`);
          }

        };


        it('should resolve extended', async function() {

          // given
          const linter = new Linter({ resolver });

          const config = {
            extends: [
              'bpmnlint:recommended',
              'plugin:test/recommended'
            ]
          };

          // when
          const rules = await linter.resolveConfiguredRules(config);

          // then
          expect(rules).to.eql({
            'bar': 'error',
            'foo': 'warn',
            'test/bar': 'warn',
            'test/other': 'warn'
          });
        });


        it('should normalize rule names', async function() {

          // given
          const linter = new Linter({ resolver });

          const config = {
            extends: [
              'bpmnlint:recommended',
              'plugin:test/recommended',
              'plugin:@ns/bpmnlint-plugin-test2/recommended'
            ],
            rules: {
              'bpmnlint/foo': 'error',
              'foo': 'error',
              'test/bar': 'off'
            }
          };

          // when
          const rules = await linter.resolveConfiguredRules(config);

          // then
          expect(rules).to.eql({
            '@ns/bpmnlint-plugin-test2/bar': 'off',
            'bar': 'error',
            'foo': 'error',
            'test/bar': 'off',
            'test/other': 'warn'
          });
        });

      });

    });


    it('should throw on missing', async function() {

      // given
      const resolver = {
        resolveConfig(pkg, configName) {
          return null;
        }
      };

      const linter = new Linter({ resolver });

      let err;

      // when
      try {
        await linter.resolveConfiguredRules({
          extends: 'plugin:foo/bar'
        });
      } catch (e) {
        // then
        expect(e.message).to.eql('unknown config <plugin:foo/bar>');

        err = e;
      }

      // verify
      expect(err).to.exist;
    });

  });


  describe('#parseConfigName', function() {

    const linter = new Linter({
      resolver: fakeRule({})
    });


    it('should parse built-in', async function() {

      // when
      const parsed = linter.parseRuleName('bpmnlint/label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint',
        ruleName: 'label-required'
      });
    });


    it('should parse built-in without prefix', async function() {

      // when
      const parsed = linter.parseRuleName('label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint',
        ruleName: 'label-required'
      });
    });


    it('should parse external', function() {

      // when
      const parsed = linter.parseRuleName('foo/label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint-plugin-foo',
        ruleName: 'label-required'
      });
    });

    it ('should parse scoped', function() {
      const parsed = linter.parseRuleName('@scoped/bpmnlint-plugin-foo/label-required');
      expect(parsed).to.eql({
        pkg: '@scoped/bpmnlint-plugin-foo',
        ruleName: 'label-required'
      });
    });
  });


  describe('#parseConfigName', function() {

    const linter = new Linter({
      resolver: fakeRule({})
    });


    describe('should parse built-in', function() {

      it('all', function() {

        // when
        const parsed = linter.parseConfigName('bpmnlint:all');

        // then
        expect(parsed).to.eql({
          pkg: 'bpmnlint',
          configName: 'all'
        });
      });


      it('recommended', function() {

        // when
        const parsed = linter.parseConfigName('bpmnlint:recommended');

        // then
        expect(parsed).to.eql({
          pkg: 'bpmnlint',
          configName: 'recommended'
        });
      });

    });


    it('should parse external', function() {

      // when
      const parsed = linter.parseConfigName('plugin:foo/bar');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint-plugin-foo',
        configName: 'bar'
      });
    });

    it('should parse scoped', function() {
      const parsed = linter.parseConfigName('plugin:@ns/bpmnlint-plugin-foo/bar');
      expect(parsed).to.eql({
        pkg: '@ns/bpmnlint-plugin-foo',
        configName: 'bar'
      });
    });


    it('should throw on invalid name', async function() {

      expect(() => {
        linter.parseConfigName('foo:bar');
      }).to.throw('invalid config name <foo:bar>');

    });


    it('should throw error on invalid scoped plugin', function() {
      expect(() => linter.parseConfigName('plugin:@ns/not-valid')).to.throw('invalid config name <plugin:@ns/not-valid>');
    });
  });


  it('caching behavior');

});


function fakeResolver(cache = {}) {
  return {
    resolveRule(pkg, ruleName) {
      return cache[`${pkg}-${ruleName}`];
    },

    resolveConfig(pkg, configName) {
      return cache[`config-${pkg}-${configName}`];
    }
  };
}


function fakeRule() {

  function check(node, reporter) {

    if (is(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions detected');
    }
  }

  return {
    check
  };
}

function buildResults(category) {
  const results = [
    {
      id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
      message: 'Definitions detected'
    }
  ];

  if (typeof category === 'undefined') {
    return results;
  }

  return results.map((result) => {
    return {
      ...result,
      category
    };
  });
}