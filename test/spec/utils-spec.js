import {
  is,
  isAny
} from '../../lib/utils';

import { expect } from '../helper';


describe('utils', function() {

  describe('is(node, type)', function() {

    const node = {
      $instanceOf(type) {
        return type === 'bpmn:Foo';
      }
    };


    it('should match node', function() {
      expect(is(node, 'Foo')).to.be.true;
      expect(is(node, 'bpmn:Foo')).to.be.true;
    });


    it('should not match node', function() {
      expect(is(node, 'Baz')).to.be.false;
    });

  });


  describe('isAny(node, [ ...types ])', function() {

    const node = {
      $instanceOf(type) {
        return type === 'bpmn:Foo';
      }
    };


    it('should match node', function() {
      expect(isAny(node, [ 'Foo', 'bpmn:Bar' ])).to.be.true;
      expect(isAny(node, [ 'bpmn:Foo' ])).to.be.true;
    });


    it('should not match node', function() {
      expect(isAny(node, [ 'Baz', 'bpmn:Blub' ])).to.be.false;
    });

  });

});
