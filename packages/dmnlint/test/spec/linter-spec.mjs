import { createRequire } from 'node:module';

import { Linter } from 'dmnlint';

import NodeResolver from 'dmnlint/lib/resolver/node-resolver.js';

import compileConfig from 'dmnlint/lib/support/compile-config.js';

import {
  expect,
  readModdle,
  stubCJS
} from '../helper.mjs';

const {
  __dirname,
  require
} = stubCJS(import.meta.url);


describe('dmnlint', function() {

  let linter;

  beforeEach(function() {
    linter = new Linter({
      resolver: new NodeResolver()
    });
  });


  describe('names', function() {

    it('should parse rule names', function() {

      expect(linter.parseRuleName('label-required')).to.eql({
        pkg: 'dmnlint',
        ruleName: 'label-required'
      });

      expect(linter.parseRuleName('dmnlint/label-required')).to.eql({
        pkg: 'dmnlint',
        ruleName: 'label-required'
      });

      expect(linter.parseRuleName('foo/label-required')).to.eql({
        pkg: 'dmnlint-plugin-foo',
        ruleName: 'label-required'
      });
    });


    it('should parse config names', function() {

      expect(linter.parseConfigName('dmnlint:recommended')).to.eql({
        pkg: 'dmnlint',
        configName: 'recommended'
      });

      expect(linter.parseConfigName('plugin:foo/recommended')).to.eql({
        pkg: 'dmnlint-plugin-foo',
        configName: 'recommended'
      });

      expect(() => linter.parseConfigName('bpmnlint:recommended')).to.throw('unparseable config name');
    });

  });


  describe('resolver', function() {

    // resolve built-ins independent of the working directory
    const resolver = new NodeResolver({
      require: createRequire('/')
    });

    it('should resolve rule', function() {

      expect(resolver.resolveRule('dmnlint', 'label-required')).to.equal(
        require('dmnlint/rules/label-required')
      );
    });


    it('should resolve config', function() {

      expect(resolver.resolveConfig('dmnlint', 'recommended')).to.equal(
        require('dmnlint/config/recommended')
      );
    });


    it('should NOT resolve bpmnlint rule', function() {

      expect(() => resolver.resolveRule('bpmnlint', 'label-required')).to.throw(
        'cannot resolve rule <label-required> from <bpmnlint>'
      );
    });

  });


  describe('linting', function() {

    it('should lint with recommended config', async function() {

      // given
      const { root } = await readModdle(__dirname + '/../rules/label-required/invalid-decision.dmn');

      // when
      const results = await linter.lint(root, {
        extends: 'dmnlint:recommended'
      });

      // then
      expect(Object.keys(results)).to.eql([ 'label-required' ]);

      expect(results['label-required']).to.have.length(1);
      expect(results['label-required'][0]).to.include({
        id: 'Element',
        message: 'Element is missing label/name',
        category: 'error'
      });
    });


    it('should lint with all config', async function() {

      // given
      const { root } = await readModdle(__dirname + '/diagram.dmn');

      // when
      const results = await linter.lint(root, {
        extends: 'dmnlint:all'
      });

      // then
      expect(results).to.eql({});
    });

  });


  describe('compile-config', function() {

    it('should import rules from <dmnlint>', async function() {

      // when
      const code = await compileConfig({
        extends: 'dmnlint:recommended'
      });

      // then
      expect(code).to.contain('import rule_0 from \'dmnlint/rules/label-required\'');
      expect(code).to.contain('cache[\'dmnlint/label-required\'] = rule_0');

      expect(code).to.contain('import rule_1 from \'dmnlint/rules/no-duplicate-requirements\'');
    });

  });

});
