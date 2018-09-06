import nodeResolver from '../../../lib/resolver/nodeResolver';

import {
  expect
} from '../../helper';


describe('nodeResolver', function() {

  describe('#resolveRule', function() {

    it('should resolve built-in', async function() {

      // when
      const parsed = nodeResolver.parseRuleName('bpmnlint/label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint',
        ruleName: 'label-required'
      });

      // and when...
      const localRule = await nodeResolver.resolveRule('bpmnlint/label-required');

      // then
      expect(localRule).to.exist;
    });


    it('should resolve built-in without prefix', async function() {

      // when
      const parsed = nodeResolver.parseRuleName('label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint',
        ruleName: 'label-required'
      });

      // and when...
      const localRule = await nodeResolver.resolveRule('label-required');

      // then
      expect(localRule).to.exist;
    });


    it('should resolve external', function() {

      // when
      const parsed = nodeResolver.parseRuleName('foo/label-required');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint-plugin-foo',
        ruleName: 'label-required'
      });
    });

  });


  describe('#resolveConfig', function() {

    describe('should resolve built-in', function() {

      it('all', async function() {

        // when
        const parsed = await nodeResolver.parseConfigName('bpmnlint:all');

        // then
        expect(parsed).to.eql({
          pkg: 'bpmnlint',
          configName: 'all'
        });

        // ...and when
        const allConfig = nodeResolver.resolveConfig('bpmnlint:all');

        // then
        expect(allConfig).to.exist;
      });


      it('recommended', async function() {

        // when
        const parsed = await nodeResolver.parseConfigName('bpmnlint:recommended');

        // then
        expect(parsed).to.eql({
          pkg: 'bpmnlint',
          configName: 'recommended'
        });

        // ...and when
        const recommendedConfig = nodeResolver.resolveConfig('bpmnlint:recommended');

        // then
        expect(recommendedConfig).to.exist;
      });

    });


    it('should resolve external', function() {

      // when
      const parsed = nodeResolver.parseConfigName('plugin:foo/bar');

      // then
      expect(parsed).to.eql({
        pkg: 'bpmnlint-plugin-foo',
        configName: 'bar'
      });
    });

  });

});