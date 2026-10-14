import {
  is,
  isAny
} from '../../lib/index.js';

import { expect } from 'chai';


describe('utils', function() {

  describe('is(node, type)', function() {

    const node = {
      $instanceOf(type) {
        return type === 'dmn:Foo';
      }
    };


    it('should match node', function() {
      expect(is(node, 'Foo')).to.be.true;
      expect(is(node, 'dmn:Foo')).to.be.true;
    });


    it('should not match node', function() {
      expect(is(node, 'Baz')).to.be.false;
    });

  });


  describe('isAny(node, [ ...types ])', function() {

    const node = {
      $instanceOf(type) {
        return type === 'dmn:Foo';
      }
    };


    it('should match node', function() {
      expect(isAny(node, [ 'Foo', 'dmn:Bar' ])).to.be.true;
      expect(isAny(node, [ 'dmn:Foo' ])).to.be.true;
    });


    it('should not match node', function() {
      expect(isAny(node, [ 'Baz', 'dmn:Blub' ])).to.be.false;
    });

  });

});
