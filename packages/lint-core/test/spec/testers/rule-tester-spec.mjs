import { createRuleTester } from '../../../lib/testers/rule-tester.js';

import { createLinter } from '../../../lib/linter.js';

import { expect } from '../../helper.mjs';


describe('testers/rule-tester', function() {

  const Linter = createLinter({ name: 'foolint' });

  const {
    verify,
    getTitle,
    expectEqual,
    replacer
  } = createRuleTester({ Linter });

  function createModdleElement(id) {

    return Promise.resolve({
      root: {
        $type: 'foo:Root',
        id,
        $descriptor: { properties: [] },
        $instanceOf: type => type === 'foo:Root'
      }
    });
  }

  const rule = () => ({
    check(node, reporter) {

      if (node.id === 'invalid') {
        reporter.report(node.id, 'invalid');
      }
    }
  });


  describe('verify', function() {

    verify('foo-rule', rule, {
      valid: [
        {
          name: 'valid',
          moddleElement: createModdleElement('valid')
        }
      ],
      invalid: [
        {
          name: 'invalid',
          moddleElement: createModdleElement('invalid'),
          report: {
            id: 'invalid',
            message: 'invalid'
          }
        }
      ]
    });

  });


  describe('getTitle', function() {

    it('should create title', function() {

      expect(getTitle(0)).to.eql('test case #1');
      expect(getTitle(1, 'foo')).to.eql('test case #2 foo');
    });

  });


  describe('expectEqual', function() {

    it('should compare serialized', function() {

      expect(() => expectEqual({ a: 1 }, { a: 1 })).not.to.throw();
      expect(() => expectEqual({ a: 1 }, { a: 2 })).to.throw();
    });

  });


  describe('replacer', function() {

    it('should serialize moddle elements to ids', function() {

      // given
      const element = {
        $type: 'foo:Bar',
        $descriptor: { idProperty: { name: 'id' } },
        get: (name) => element[name],
        id: 'Bar_1'
      };

      // then
      expect(replacer('', element)).to.eql('Bar_1');
    });

    it('should fall back to type', function() {

      // given
      const element = {
        $type: 'foo:Bar',
        $descriptor: {}
      };

      // then
      expect(replacer('', element)).to.eql('foo:Bar');
    });

  });

});
