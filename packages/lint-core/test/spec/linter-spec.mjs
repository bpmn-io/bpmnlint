import { expect } from '../helper.mjs';

import { createLinter } from '../../lib/linter.js';


describe('linter', function() {

  const resolver = {
    resolveRule() {},
    resolveConfig() {}
  };


  describe('createLinter', function() {

    it('should require valid product', function() {

      expect(() => createLinter({})).to.throw('must provide <product.name>');
      expect(() => createLinter()).to.throw('must provide <product.name>');
    });


    it('should create independent linters', function() {

      // when
      const FooLinter = createLinter({ name: 'foolint' });
      const BarLinter = createLinter({ name: 'barlint' });

      // then
      expect(FooLinter).not.to.equal(BarLinter);
      expect(new FooLinter({ resolver })).to.be.instanceOf(FooLinter);
      expect(new FooLinter({ resolver })).not.to.be.instanceOf(BarLinter);
    });

  });


  describe('product name', function() {

    let linter;

    beforeEach(function() {
      const Linter = createLinter({ name: 'foolint' });

      linter = new Linter({ resolver });
    });


    describe('#parseRuleName', function() {

      it('should parse built-in', function() {

        expect(linter.parseRuleName('foolint/label-required')).to.eql({
          pkg: 'foolint',
          ruleName: 'label-required'
        });

        expect(linter.parseRuleName('label-required')).to.eql({
          pkg: 'foolint',
          ruleName: 'label-required'
        });
      });


      it('should default to local package', function() {

        expect(linter.parseRuleName('label-required', 'local')).to.eql({
          pkg: 'local',
          ruleName: 'label-required'
        });
      });


      it('should parse external', function() {

        expect(linter.parseRuleName('bar/label-required')).to.eql({
          pkg: 'foolint-plugin-bar',
          ruleName: 'label-required'
        });

        expect(linter.parseRuleName('foolint-plugin-bar/label-required')).to.eql({
          pkg: 'foolint-plugin-bar',
          ruleName: 'label-required'
        });

        expect(linter.parseRuleName('@scoped/bar/label-required')).to.eql({
          pkg: '@scoped/foolint-plugin-bar',
          ruleName: 'label-required'
        });
      });


      it('should not special-case other products', function() {

        expect(linter.parseRuleName('bpmnlint/label-required')).to.eql({
          pkg: 'foolint-plugin-bpmnlint',
          ruleName: 'label-required'
        });
      });

    });


    describe('#parseConfigName', function() {

      it('should parse built-in', function() {

        expect(linter.parseConfigName('foolint:recommended')).to.eql({
          pkg: 'foolint',
          configName: 'recommended'
        });
      });


      it('should parse external', function() {

        expect(linter.parseConfigName('plugin:bar/recommended')).to.eql({
          pkg: 'foolint-plugin-bar',
          configName: 'recommended'
        });

        expect(linter.parseConfigName('plugin:@ns/foolint-plugin-bar/recommended')).to.eql({
          pkg: '@ns/foolint-plugin-bar',
          configName: 'recommended'
        });
      });


      it('should throw on other products', function() {

        expect(() => linter.parseConfigName('bpmnlint:recommended')).to.throw(
          'unparseable config name <bpmnlint:recommended>'
        );
      });

    });


    describe('#getSimplePackageName', function() {

      it('should unprefix', function() {

        expect(linter.getSimplePackageName('foolint')).to.eql('foolint');
        expect(linter.getSimplePackageName('foolint-plugin-bar')).to.eql('bar');
        expect(linter.getSimplePackageName('@ns/foolint-plugin-bar')).to.eql('@ns/bar');
        expect(linter.getSimplePackageName('bpmnlint-plugin-bar')).to.eql('bpmnlint-plugin-bar');
      });

    });


    describe('#normalizeConfig', function() {

      it('should normalize rule names', function() {

        // when
        const { rules } = linter.normalizeConfig({
          rules: {
            'foolint/a': 'error',
            'b': 'warn',
            'foolint-plugin-bar/c': 'error',
            'baz/d': 'error'
          }
        });

        // then
        expect(rules).to.eql({
          a: 'error',
          b: 'warn',
          'bar/c': 'error',
          'baz/d': 'error'
        });
      });

    });


    describe('#lint', function() {

      it('should resolve rules from the product package', async function() {

        // given
        const resolved = [];

        const Linter = createLinter({ name: 'foolint' });

        const linter = new Linter({
          resolver: {
            resolveRule(pkg, ruleName) {
              resolved.push(`${pkg}/${ruleName}`);

              return () => ({ check() {} });
            },
            resolveConfig() {}
          }
        });

        const root = {
          $type: 'foo:Root',
          $descriptor: { properties: [] }
        };

        // when
        await linter.lint(root, {
          rules: {
            'a': 'error',
            'foolint/b': 'error',
            'bar/c': 'error'
          }
        });

        // then
        expect(resolved).to.eql([
          'foolint/a',
          'foolint/b',
          'foolint-plugin-bar/c'
        ]);
      });

    });

  });


  describe('plugin prefix', function() {

    it('should be configurable', function() {

      // given
      const Linter = createLinter({
        name: 'foolint',
        pluginPrefix: 'foo-'
      });

      const linter = new Linter({ resolver });

      // then
      expect(linter.parseRuleName('bar/a')).to.eql({ pkg: 'foo-bar', ruleName: 'a' });
      expect(linter.parseRuleName('foo-bar/a')).to.eql({ pkg: 'foo-bar', ruleName: 'a' });
      expect(linter.getSimplePackageName('foo-bar')).to.eql('bar');
    });

  });


  describe('special characters in product name', function() {

    it('should match config name literally', function() {

      // given
      const Linter = createLinter({ name: 'foo.lint' });

      const linter = new Linter({ resolver });

      // then
      expect(linter.parseConfigName('foo.lint:all')).to.eql({
        pkg: 'foo.lint',
        configName: 'all'
      });

      expect(() => linter.parseConfigName('fooxlint:all')).to.throw();
    });

  });

});
