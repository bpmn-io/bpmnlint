import Linter from '../../lib/linter';

import {
  expect,
  readModdle,
  createRule
} from '../helper';


describe('linter', function() {

  describe('#applyRule', function() {

    let moddleRoot;

    const linter = new Linter({
      resolver: fakeResolver()
    });


    beforeEach(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    describe('should apply categories', function() {

      function test(ruleFlag, expectedResult) {

        it(`${ruleFlag}`, function() {

          // when
          const results = linter.applyRule({
            moddleRoot,
            ruleFlag,
            rule: createRule(fakeRule)
          });

          // then
          expect(results).to.eql(expectedResult);
        });

      }

      test('off', []);
      test('warn', buildResults());
      test('error', buildResults());
    });


  });


  describe('#lint', function() {

    let moddleRoot;

    before(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    it('should run without rules', async function() {

      // given
      const resolver = {
        resolveRule() {
          throw new Error('unexpected invocation');
        }
      };

      const linter = new Linter({ resolver });

      // when
      const lintResults = await linter.lint(moddleRoot, {});

      // then
      expect(lintResults).to.eql({});
    });


    it('should resolve rules', async function() {

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


    it('should handle unresolved rules', async function() {

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

      expect(error.message).to.eql('unknown rule <bpmnlint/unknownRule>');
    });

  });


  describe('#parseRuleValue', function() {

    it('should extract { ruleFlag, ruleConfig }', function() {

      // given
      const linter = new Linter({ resolver: fakeResolver() });


      // then
      expect(linter.parseRuleValue(0)).to.eql({
        ruleFlag: 'off',
        ruleConfig: {}
      });

      expect(linter.parseRuleValue([ 0, 'A' ])).to.eql({
        ruleFlag: 'off',
        ruleConfig: 'A'
      });

      expect(linter.parseRuleValue(1)).to.eql({
        ruleFlag: 'warn',
        ruleConfig: {}
      });

      expect(linter.parseRuleValue(2)).to.eql({
        ruleFlag: 'error',
        ruleConfig: {}
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
          'bpmnlint/foo': 'warn'
        });
      });


      describe('multiple parents', function() {

        // given
        const resolver = {

          resolveRule(ruleName) {
            return { check() { } };
          },

          resolveConfig(pkg, configName) {

            if (pkg === 'bpmnlint' && configName === 'recommended') {
              return {
                rules: {
                  foo: 'warn',
                  bar: 'warn'
                }
              };
            }

            if (pkg === 'bpmnlint-plugin-foo') {
              if (configName === 'recommended') {
                return {
                  extends: 'plugin:foo/base',
                  rules: {
                    other: 'warn'
                  }
                };
              }

              if (configName === 'base') {
                return {
                  rules: {
                    'bpmnlint/bar': 'error',
                    'other': 'error'
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
              'plugin:foo/recommended'
            ]
          };

          // when
          const rules = await linter.resolveConfiguredRules(config);

          // then
          expect(rules).to.eql({
            'bpmnlint/bar': 'error',
            'bpmnlint/foo': 'warn',
            'foo/other': 'warn'
          });
        });


        it('should normalize rule names', async function() {

          // given
          const linter = new Linter({ resolver });

          const config = {
            extends: [
              'bpmnlint:recommended',
              'plugin:foo/recommended'
            ],
            rules: {
              foo: 'error'
            }
          };

          // when
          const rules = await linter.resolveConfiguredRules(config);

          // then
          expect(rules).to.eql({
            'bpmnlint/bar': 'error',
            'bpmnlint/foo': 'error',
            'foo/other': 'warn'
          });
        });

      });

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

  });

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


function fakeRule(utils) {

  const {
    is
  } = utils;

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