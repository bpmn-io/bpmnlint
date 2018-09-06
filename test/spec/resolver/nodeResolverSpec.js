import NodeResolver from '../../../lib/resolver/nodeResolver';

import {
  expect
} from '../../helper';


describe('NodeResolver', function() {

  describe('#resolveRule', function() {

    const nodeResolver = createResolver(function(path) {

      // mock node resolution
      if (path === 'bpmnlint') {
        throw new Error('not found');
      }

      return {
        path
      };
    });


    it('should resolve built-in', async function() {

      // when
      const resolvedRule = await nodeResolver.resolveRule('bpmnlint', 'label-required');

      // then
      expect(resolvedRule).to.eql({
        path: 'bpmnlint/rules/label-required'
      });
    });


    it('should resolve external', async function() {

      // when
      const resolvedRule = await nodeResolver.resolveRule('foo', 'label-required');

      // then
      expect(resolvedRule).to.eql({
        path: 'foo/rules/label-required'
      });
    });

  });


  describe('#resolveConfig', function() {

    const nodeResolver = createResolver(function(path) {

      // mock node resolution
      if (path.indexOf('bpmnlint/') === 0) {
        throw new Error('not found');
      }

      if (path === 'bpmnlint-plugin-foo/config/embedded') {
        throw new Error('not found');
      }

      // mimic $PKG/config/$NAME resolution
      if (path === 'bpmnlint-plugin-foo/config/bar') {
        return {
          path,
          bar: true
        };
      }

      if (path.indexOf('config') !== -1) {
        return {
          path
        };
      }

      // mimic $PKG.configs[$NAME] resolution
      if (path === 'bpmnlint-plugin-foo') {
        return {
          configs: {
            embedded: {
              path,
              embedded: true
            }
          }
        };
      }

      throw new AssertionError('unexpected path <' + path + '>');
    });


    describe('should resolve built-in', function() {

      it('all', async function() {

        // when
        const resolvedConfig = await nodeResolver.resolveConfig('bpmnlint', 'all');

        // then
        expect(resolvedConfig).to.eql({
          path: '../../config/all'
        });
      });


      it('recommended', async function() {

        // when
        const resolvedConfig = await nodeResolver.resolveConfig('bpmnlint', 'recommended');

        // then
        expect(resolvedConfig).to.eql({
          path: '../../config/recommended'
        });
      });

    });


    describe('should resolve external', function() {

      it('via $PKG/config/$NAME', async function() {

        // when
        const resolvedConfig = await nodeResolver.resolveConfig('bpmnlint-plugin-foo', 'bar');

        // then
        expect(resolvedConfig).to.eql({
          path: 'bpmnlint-plugin-foo/config/bar',
          bar: true
        });

      });


      it('via $PKG.configs[$NAME]', async function() {

        // when
        const resolvedConfig = await nodeResolver.resolveConfig('bpmnlint-plugin-foo', 'embedded');

        // then
        expect(resolvedConfig).to.eql({
          path: 'bpmnlint-plugin-foo',
          embedded: true
        });

      });
    });

  });

});


// helpers /////////////////////////////

function createResolver(requireFn) {
  return new NodeResolver({
    require: requireFn
  });
}