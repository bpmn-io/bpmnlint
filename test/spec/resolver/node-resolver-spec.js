import NodeResolver from '../../../lib/resolver/node-resolver';

import {
  expect
} from '../../helper';


describe('resolver/node-resolver', function() {

  describe('#resolveRule', function() {

    const resolver = createResolver(function(path) {

      // mimic local package look-up
      if (path === './package.json') {
        return {
          name: 'bpmnlint-plugin-local'
        };
      }

      if (path.includes('rules/non-existing')) {
        throw new Error('not found');
      }

      return {
        path
      };
    }, function(path) {

      if (path === '../../rules/non-existing') {
        throw new Error('not found');
      }

      return {
        path
      };
    });


    it('should resolve built-in', async function() {

      // when
      const resolvedRule = await resolver.resolveRule('bpmnlint', 'label-required');

      // then
      expect(resolvedRule).to.eql({
        path: '../../rules/label-required'
      });
    });


    it('should fail to resolve built-in', async function() {

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


    it('should resolve external', async function() {

      // when
      const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-foo', 'label-required');

      // then
      expect(resolvedRule).to.eql({
        path: 'bpmnlint-plugin-foo/rules/label-required'
      });
    });


    it('should resolve local package', async function() {

      // when
      const resolvedRule = await resolver.resolveRule('bpmnlint-plugin-local', 'label-required');

      // then
      expect(resolvedRule).to.eql({
        path: './rules/label-required'
      });
    });


    it('should fail to resolve external', async function() {

      let err;

      // when
      try {
        await resolver.resolveRule('bpmnlint-plugin-baz', 'non-existing');
      } catch (e) {

        // then
        expect(e.message).to.eql('Cannot resolve rule <non-existing> from <bpmnlint-plugin-baz>');

        err = e;
      }

      // verify
      expect(err).to.exist;
    });


    it('should fail to resolve local', async function() {

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


  describe('#resolveConfig', function() {

    const resolver = createResolver(function(path) {

      // mimic local package look-up
      if (path === './package.json') {
        return {
          path,
          name: 'bpmnlint-plugin-local'
        };
      }

      // mimic $PKG/config/$NAME resolution
      if (path.includes('config/bar')) {
        return {
          path,
          bar: true
        };
      }

      // mimic embedded config not found via $PKG/config/$NAME
      if (path.includes('config/embedded')) {
        throw new Error('not found');
      }

      // mimic $PKG.configs[$NAME] resolution
      if (path === 'bpmnlint-plugin-foo' || path === '.') {
        return {
          configs: {
            embedded: {
              path,
              embedded: true
            }
          }
        };
      }

      throw new Error('unexpected path <' + path + '>');
    }, function(path) {

      if (path === '../../config/non-existing') {
        throw new Error('not found');
      }

      return {
        path
      };
    });


    describe('should resolve built-in', function() {

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

    });


    it('should fail to resolve built-in', async function() {

      let err;

      // when
      try {
        await resolver.resolveConfig('bpmnlint', 'non-existing');
      } catch (e) {
        expect(e.message).to.eql(
          'Cannot resolve config <non-existing> from <bpmnlint>'
        );

        err = e;
      }

      // verify
      expect(err).to.exist;
    });


    describe('should resolve external', function() {

      it('via $PKG/config/$NAME', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-foo', 'bar');

        // then
        expect(resolvedConfig).to.eql({
          path: 'bpmnlint-plugin-foo/config/bar',
          bar: true
        });

      });


      it('via $PKG.configs[$NAME]', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-foo', 'embedded');

        // then
        expect(resolvedConfig).to.eql({
          path: 'bpmnlint-plugin-foo',
          embedded: true
        });

      });

    });


    describe('should resolve local package', function() {

      it('via ./config/$NAME', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-local', 'bar');

        // then
        expect(resolvedConfig).to.eql({
          path: './config/bar',
          bar: true
        });
      });


      it('via .configs[$NAME]', async function() {

        // when
        const resolvedConfig = await resolver.resolveConfig('bpmnlint-plugin-local', 'embedded');

        // then
        expect(resolvedConfig).to.eql({
          path: '.',
          embedded: true
        });
      });

    });


    it('should fail to resolve external', async function() {

      let err;

      // when
      try {
        await resolver.resolveConfig('bpmnlint-plugin-foo', 'non-existing');
      } catch (e) {
        expect(e.message).to.eql(
          'Cannot resolve config <non-existing> from <bpmnlint-plugin-foo>'
        );

        err = e;
      }

      // verify
      expect(err).to.exist;
    });


    it('should fail to resolve local', async function() {

      let err;

      // when
      try {
        await resolver.resolveConfig('bpmnlint-plugin-local', 'non-existing');
      } catch (e) {
        expect(e.message).to.eql(
          'Cannot resolve config <non-existing> from <bpmnlint-plugin-local>'
        );

        err = e;
      }

      // verify
      expect(err).to.exist;
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