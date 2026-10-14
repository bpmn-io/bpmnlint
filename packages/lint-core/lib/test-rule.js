const traverse = require('./traverse');

const {
  isArray,
  isObject,
  isFunction
} = require('min-dash');


/**
 * @typedef { import('./types.js').EnterFn } EnterFn
 * @typedef { import('./types.js').ModdleElement } ModdleElement
 * @typedef { import('./types.js').RuleDefinition } RuleDefinition
 * @typedef { import('./types.js').Report } Report
 */


class Reporter {

  /**
   * @param { {
   *   moddleRoot: ModdleElement,
   *   rule: RuleDefinition
   * } } options
   */
  constructor({ moddleRoot, rule }) {
    this.rule = rule;
    this.moddleRoot = moddleRoot;

    /**
     * @type { Report[] }
     */
    this.messages = [];

    this.report = this.report.bind(this);
  }

  /**
   * @param { string } id
   * @param { string } message
   * @param { string[] | { path?: string[], [key: string]: any } } [path]
   *
   * @example
   *
   * ```javascript
   * reporter.report('foo', 'Foo error', [ 'foo', 'bar', 'baz' ]);
   *
   * reporter.report('foo', 'Foo error', {
   *   path: [ 'foo', 'bar', 'baz' ],
   *   foo: 'foo'
   * });
   * ```
   */
  report(id, message, path) {
    let report = {
      id,
      message
    };

    if (path && isArray(path)) {
      report = {
        ...report,
        path
      };
    }

    if (path && isObject(path)) {
      report = {
        ...report,
        ...path
      };
    }

    this.messages.push(report);
  }
}

/**
 * @param { {
 *   moddleRoot: ModdleElement,
 *   rule: RuleDefinition,
 *   config: any
 * } } options
 *
 * @return { Report[] } lint reports
 */
module.exports = function testRule({ moddleRoot, rule }) {
  const reporter = new Reporter({ rule, moddleRoot });

  const check = rule.check || {};

  const leave = 'leave' in check ? check.leave : undefined;
  const enter = 'enter' in check ? check.enter : (
    isFunction(check) ? check : undefined
  );

  if (!enter && !leave) {
    throw new Error('no check implemented');
  }

  traverse(moddleRoot, {
    enter: enter ? (node) => enter(node, reporter) : undefined,
    leave: leave ? (node) => leave(node, reporter) : undefined
  });

  return reporter.messages;
};
