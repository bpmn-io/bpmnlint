/* global it, describe, beforeEach */

const assert = require('assert');

function createResolver(rule) {

  return {
    resolveRule: () => Promise.resolve(rule),

    resolveConfig: () => {
      throw new Error('not implemented');
    }
  };
}

function expectEqual(a, b) {
  assert.deepStrictEqual(JSON.stringify(a, replacer, 2), JSON.stringify(b, replacer, 2));
}

/**
 * Create a rule tester that lints with the given `Linter`.
 *
 * @param { { Linter: any } } product the product `Linter`
 *
 * @return { {
 *   expectEqual: typeof expectEqual,
 *   verify: (ruleName: string, rule: any, testCases: any) => void,
 *   getTitle: typeof getTitle,
 *   replacer: typeof replacer
 * } }
 */
function createRuleTester({ Linter }) {

  function verify(ruleName, rule, testCases) {
    function createLinterConfig(config = {}) {
      return {
        rules: { [ruleName]: [ 2, config ] }
      };
    }

    describe(`rules/${ruleName}`, function() {

      let linter;

      beforeEach(function() {
        linter = new Linter({
          resolver: createResolver(rule)
        });
      });


      describe('should lint valid', function() {

        testCases.valid.forEach(({ config = {}, it: _it, moddleElement, name }, idx) => (

          (_it || it)(getTitle(idx, name), function() {
            return (
              Promise.resolve(moddleElement)
                .then(moddleRoot => {
                  return linter.lint(moddleRoot.root, createLinterConfig(config));
                })
                .then(lintResults => {
                  expectEqual(lintResults, {});
                })
            );
          })

        ));

      });


      describe('should lint invalid', function() {

        testCases.invalid.forEach(({ config = {}, it: _it, moddleElement, name, report }, idx) => (

          (_it || it)(getTitle(idx, name), async function() {

            if (!Array.isArray(report)) {
              report = [
                report
              ];
            }

            const {
              meta
            } = await linter.resolveRule(name, config);

            const expectedResults = report.map(report => {
              return {
                ...report,
                meta,
                category: 'error'
              };
            });

            const expectedLintResults = {
              [ruleName]: expectedResults
            };

            return (
              Promise.resolve(moddleElement)
                .then(moddleRoot => {
                  return linter.lint(moddleRoot.root, createLinterConfig(config));
                })
                .then(lintResults => {
                  expectEqual(lintResults, expectedLintResults);
                })
            );
          })

        ));

      });

    });

  }

  return {
    expectEqual,
    verify,
    getTitle,
    replacer
  };
}

function getTitle(idx, name) {
  return `test case #${ idx + 1 }${ name ? ` ${ name }` : '' }`;
}

function replacer(_, value) {
  if (!value) {
    return value;
  }

  const { $type } = value;

  if ($type) {
    const { $descriptor } = value;

    const { idProperty } = $descriptor;

    if (idProperty) {
      const { name } = idProperty;

      const id = value.get(name);

      if (id) {
        return id;
      } else {
        return $type;
      }
    } else {
      return $type;
    }
  }

  return value;
}

module.exports = {
  createRuleTester
};