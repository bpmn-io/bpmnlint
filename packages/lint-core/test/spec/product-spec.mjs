import { expect } from '../helper.mjs';

import { normalizeProduct, escapeRegExp } from '../../lib/product.js';


describe('product', function() {

  describe('normalizeProduct', function() {

    it('should default <pluginPrefix>', function() {

      // when
      const product = normalizeProduct({ name: 'foolint' });

      // then
      expect(product).to.eql({
        name: 'foolint',
        pluginPrefix: 'foolint-plugin-'
      });
    });


    it('should keep <pluginPrefix>', function() {

      // when
      const product = normalizeProduct({
        name: 'foolint',
        pluginPrefix: 'foo-'
      });

      // then
      expect(product.pluginPrefix).to.eql('foo-');
    });


    it('should require <name>', function() {

      expect(() => normalizeProduct({})).to.throw('must provide <product.name>');
      expect(() => normalizeProduct()).to.throw('must provide <product.name>');
    });

  });


  describe('escapeRegExp', function() {

    it('should escape special characters', function() {

      // when
      const escaped = escapeRegExp('foo.lint+(x)');

      // then
      expect(new RegExp('^' + escaped + '$').test('foo.lint+(x)')).to.be.true;
      expect(new RegExp('^' + escaped + '$').test('fooxlint+(x)')).to.be.false;
    });

  });

});
