import BpmnModdle from 'bpmn-moddle';

import {
  expectEqual,
  getTitle,
  replacer,
  verify
} from '../../../lib/testers/rule-tester';

import {
  createModdle,
  expect
} from '../../helper';


describe('rule-tester', function() {

  let moddle;

  beforeEach(function() {
    moddle = new BpmnModdle();
  });


  describe('#expectEqual', function() {

    it('should not be equal', function() {

      // given
      const a = { foo: 'bar' };
      const b = { foo: 'baz' };

      // when
      // then
      expect(() => expectEqual(a, b)).to.throw();
    });


    it('should be equal (moddle element with ID)', function() {

      // given
      const a = { node: moddle.create('bpmn:Task', { id: 'Task_1' }) };
      const b = { node: 'Task_1' };

      // when
      // then
      expect(() => expectEqual(a, b)).not.to.throw();
    });


    it('should be equal (moddle element with no ID)', function() {

      // given
      const a = { node: moddle.create('bpmn:Task') };
      const b = { node: 'bpmn:Task' };

      // when
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


  describe('#replacer', function() {

    it('should replace node', function() {

      // given
      const report = {
        foo: 'bar',
        bar: 0,
        baz: [
          {
            foo: 'bar'
          },
          moddle.create('bpmn:Task'),
          1
        ]
      };

      // when
      // then
      expect(JSON.stringify(report, replacer, 2)).to.eql(JSON.stringify({
        foo: 'bar',
        bar: 0,
        baz: [
          {
            foo: 'bar'
          },
          'bpmn:Task',
          1
        ]
      }, null, 2));

    });

  });


  describe('#verify', function() {

    describe('with local config', function() {

      verify('with-local-config', (config) => {
        return {
          check: (node, reporter) => {
            reporter.report(node.get('id'), config);
          }
        };
      }, {
        valid: [],
        invalid: [
          {
            name: 'with config',
            config: 'foo',
            moddleElement: createModdle('<bpmn:Task id="Task_1" />', 'bpmn:Task'),
            report: {
              id: 'Task_1',
              message: 'foo'
            }
          }
        ]
      });

    });

  });

});