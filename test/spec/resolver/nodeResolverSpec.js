import nodeResolver from '../../../lib/resolver/nodeResolver';

import {
  expect
} from '../../helper';


describe('nodeResolver', function() {

  describe('#resolveRule', function() {

    it('should resolve built-in', async function() {

      // when
      const { path } = nodeResolver.parseRuleName('label-required');

      // then
      expect(path).to.eql('../../rules/label-required');

      // and when...
      const localRule = await nodeResolver.resolveRule('label-required');

      // then
      expect(localRule).to.exist;
    });


    it('should resolve external', function() {

      // when
      const { path } = nodeResolver.parseRuleName('foo/label-required');

      // then
      expect(path).to.eql('bpmnlint-plugin-foo/rules/label-required');
    });

  });


  describe('#resolveConfig', function() {

    it('should resolve built-in', async function() {

      // when
      const {
        path
      } = await nodeResolver.parseConfigName('bpmnlint:recommended');

      // then
      expect(path).to.eql('../../config/recommended');

      // ...and when
      const recommendedConfig = nodeResolver.resolveConfig('bpmnlint:recommended');

      // then
      expect(recommendedConfig).to.exist;
    });


    it('should resolve external', function() {

      // when
      const {
        path,
        config
      } = nodeResolver.parseConfigName('plugin:foo/bar');

      // then
      expect(path).to.eql('bpmnlint-plugin-foo');
      expect(config).to.eql('bar');
    });

  });

});