const traverse = require('./traverse');

const {
  isArray,
  isObject,
  isFunction
} = require('min-dash');


class Reporter {
  constructor({ moddleRoot, rule }) {
    this.rule = rule;
    this.moddleRoot = moddleRoot;
    this.messages = [];
    this.report = this.report.bind(this);
  }

  /**
   * @param {string} id
   * @param {string} message
   * @param {string[]|Object} path
   *
   * @example
   *
   * Reporter.report('foo', 'Foo error', [ 'foo', 'bar', 'baz' ]);
   *
   * @example
   *
   * Reporter.report('foo', 'Foo error', {
   *  path: [ 'foo', 'bar', 'baz' ],
   *  foo: 'foo'
   * });
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
    enter: enter ? (node) => enter(node, reporter) : null,
    leave: leave ? (node) => leave(node, reporter) : null
  });

  return reporter.messages;
};
