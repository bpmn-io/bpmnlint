import { createNodeResolver } from '../../../lib/resolver/node-resolver.js';

import { expect } from '../../helper.mjs';


describe('resolver/node-resolver', function() {

  const product = { name: 'foolint' };

  /**
   * Create a stub for <require> that resolves the given modules.
   *
   * @param { Record<string, any> } modules
   *
   * @return { NodeRequire }
   */
  function stubRequire(modules) {

    const require = function(path) {

      if (path in modules) {
        return modules[path];
      }

      throw new Error('not found: ' + path);
    };

    require.resolve = function(path) {
      throw new Error('not found: ' + path);
    };

    return /** @type { NodeRequire } */ (require);
  }


  it('should require <requireLocal>', function() {

    expect(() => createNodeResolver(product)).to.throw('must provide <options.requireLocal>');
  });


  it('should require valid product', function() {

    expect(() => createNodeResolver({}, { requireLocal: stubRequire({}) })).to.throw(
      'must provide <product.name>'
    );
  });


  describe('product package', function() {

    let resolver;

    beforeEach(function() {

      const NodeResolver = createNodeResolver(product, {
        requireLocal: stubRequire({
          '../../rules/label-required': { path: 'rules/label-required' },
          '../../config/recommended': { path: 'config/recommended' }
        })
      });

      resolver = new NodeResolver({
        require: stubRequire({
          './package.json': { name: 'foolint-plugin-local' }
        })
      });
    });


    it('should resolve rule locally', function() {

      // when
      const rule = resolver.resolveRule('foolint', 'label-required');

      // then
      expect(rule).to.eql({ path: 'rules/label-required' });
    });


    it('should resolve config locally', function() {

      // when
      const config = resolver.resolveConfig('foolint', 'recommended');

      // then
      expect(config).to.eql({ path: 'config/recommended' });
    });


    it('should fail to resolve unknown rule', function() {

      expect(() => resolver.resolveRule('foolint', 'unknown')).to.throw(
        'cannot resolve rule <unknown> from <foolint>'
      );
    });


    it('should NOT resolve <bpmnlint> locally', function() {

      expect(() => resolver.resolveRule('bpmnlint', 'label-required')).to.throw(
        'cannot resolve rule <label-required> from <bpmnlint>'
      );
    });

  });


  describe('<requireLocal> override', function() {

    it('should be preferred over default', function() {

      // given
      const NodeResolver = createNodeResolver(product, {
        requireLocal: stubRequire({})
      });

      const resolver = new NodeResolver({
        require: stubRequire({}),
        requireLocal: stubRequire({
          '../../rules/foo': { path: 'override' }
        })
      });

      // then
      expect(resolver.resolveRule('foolint', 'foo')).to.eql({ path: 'override' });
    });

  });


  describe('#normalizePkg', function() {

    it('should map local package to <.>', function() {

      // given
      const NodeResolver = createNodeResolver(product, {
        requireLocal: stubRequire({})
      });

      const resolver = new NodeResolver({
        require: stubRequire({
          './package.json': { name: 'foolint-plugin-local' }
        })
      });

      // then
      expect(resolver.normalizePkg('foolint-plugin-local')).to.eql('.');
      expect(resolver.normalizePkg('foolint-plugin-other')).to.eql('foolint-plugin-other');
    });


    it('should NOT map product package', function() {

      // given
      const NodeResolver = createNodeResolver(product, {
        requireLocal: stubRequire({})
      });

      const resolver = new NodeResolver({
        require: stubRequire({
          './package.json': { name: 'foolint' }
        })
      });

      // then
      expect(resolver.normalizePkg('foolint')).to.eql('foolint');
    });

  });

});
