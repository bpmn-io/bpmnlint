import BpmnModdle from 'bpmn-moddle';

import {
  expectEqual,
  getTitle
} from '../../../lib/testers/rule-tester';

import { expect } from '../../helper';


describe('rule-tester', function() {

  let moddle;

  beforeEach(function() {
    moddle = new BpmnModdle();
  });


  describe('expectEqual', function() {

    it('should not be equal', function() {

      const a = { foo: 'bar' };
      const b = { foo: 'baz' };

      // then
      expect(() => expectEqual(a, b)).to.throw();
    });


    it('should be equal (moddle element with ID)', function() {

      const a = { node: moddle.create('bpmn:Task', { id: 'Task_1' }) };
      const b = { node: 'Task_1' };

      // then
      expect(() => expectEqual(a, b)).not.to.throw();
    });


    it('should be equal (moddle element with no ID)', function() {

      const a = { node: moddle.create('bpmn:Task') };
      const b = { node: 'bpmn:Task' };

      // then
      expect(() => expectEqual(a, b)).not.to.throw();
    });

  });


  describe('#getTitle', function() {

    it('it should get name (index)', function() {

      // when
      const title = getTitle(1);

      // then
      expect(title).to.equal('test case #2');
    });


    it('it should get name (index and name)', function() {

      // when
      const title = getTitle(1, 'foo');

      // then
      expect(title).to.equal('test case #2 foo');
    });

  });

});