import {
  lint,
  applyRule
} from '../../lib/linter';

import {
  expect,
  readModdle,
  createRule
} from '../helper';


describe('linter', function() {

  describe('#applyRule', function() {

    it('should apply rule', async function() {

      const {
        root
      } = await readModdle(__dirname + '/diagram.bpmn');

      // when
      const results = applyRule({
        moddleRoot: root,
        ruleFlag: 1,
        rule: createRule(fakeRule)
      });

      // then
      expect(results).to.exist;
    });

  });


  describe('lint', function() {

  });

});



function fakeRule(utils) {

  const {
    isNodeOfType
  } = utils;

  function check(node, reporter) {

    if (isNodeOfType(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions detected');
    }
  }

  return {
    check
  };
}