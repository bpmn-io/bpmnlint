import { lint, applyRule } from '../../lib/linter';

import { expect, readModdle, createRule } from '../helper';

describe('linter', function() {
  describe('#applyRule', function() {
    let root;

    beforeEach(async function() {
      const result = await readModdle({
        filePath: __dirname + '/diagram.bpmn'
      });

      root = result.root;
    });

    describe('should apply categories', function() {
      function test(flag, expectedResult) {
        it(`${flag}`, function() {
          // when
          const results = applyRule({
            moddleRoot: root,
            ruleFlag: flag,
            rule: createRule(fakeRule)
          });

          // then
          expect(results).to.eql(expectedResult);
        });
      }

      test('off', {});
      test(0, {});

      test(1, buildResults('warnings'));
      test('WARN', buildResults('warnings'));

      test(2, buildResults('errors'));
      test('error', buildResults('errors'));
    });
  });

  describe('lint', function() {});
});

function fakeRule(utils) {
  const { isNodeOfType } = utils;

  function check(node, reporter) {
    if (isNodeOfType(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions detected');
    }
  }

  return {
    check
  };
}

function buildResults(category) {
  return {
    [category]: [
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions detected'
      }
    ]
  };
}
