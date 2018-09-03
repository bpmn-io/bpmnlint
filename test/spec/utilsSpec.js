import {
  is
} from '../../lib/utils';

import { expect } from '../helper';


describe('utils', function() {

  describe('is(node, type)', function() {

    const node = {
      $instanceOf(type) {
        return type === 'bpmn:Foo';
      }
    };


    it('should return true if node is of given type', function() {
      expect(is(node, 'Foo')).to.be.true;
      expect(is(node, 'bpmn:Foo')).to.be.true;
    });


    it('should return false if node is not of given type', function() {
      expect(is(node, 'Baz')).to.be.false;
    });

  });

});
