import Linter from '../../lib/linter';

import {
  expect,
  readModdle,
  createRule
} from '../helper';


describe('Linter', function() {

  describe('#applyRule', function() {

    let moddleRoot;

    const linter = new Linter({
      ruleResolver: fakeResolver({})
    });


    beforeEach(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    describe('should apply categories', function() {

      function test(ruleFlag, expectedResult) {

        it(`${ruleFlag}`, function() {

          // when
          const results = linter.applyRule({
            moddleRoot,
            ruleFlag,
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


  describe('#lint', function() {

    let moddleRoot;

    before(async function() {
      const result = await readModdle(__dirname + '/diagram.bpmn');

      moddleRoot = result.root;
    });


    it('should resolve rules', async function() {

      // given
      const ruleResolver = {
        resolve(ruleName) {
          expect(ruleName).to.eql('testRule');

          return fakeRule;
        }
      };

      const linter = new Linter({ ruleResolver });

      // when
      const lintResults = await linter.lint(moddleRoot, {
        rules: {
          testRule: 'warn'
        }
      });

      // then
      expect(lintResults).to.eql(buildResults('warnings'));
    });


    it('should handle unresolved rules', async function() {

      // given
      const ruleResolver = {
        resolve(ruleName) {
          return null;
        }
      };

      const linter = new Linter({ ruleResolver });

      let error;

      try {
        await linter.lint(moddleRoot, {
          rules: {
            unknownRule: 'warn'
          }
        });
      } catch (e) {
        error = e;
      }

      // then
      expect(error).to.exist;

      expect(error.message).to.eql('unknown rule <unknownRule>');
    });

  });

});


function fakeResolver(ruleMap) {
  return {
    resolve(ruleName) {
      return ruleMap[ruleName];
    }
  };
}


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

function buildResults(category) {

  return {
    [category]: [
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions detected'
      }
    ]
  }
}