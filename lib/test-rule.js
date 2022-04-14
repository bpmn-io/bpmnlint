const traverse = require('./traverse');

class Reporter {
  constructor({ moddleRoot, rule }) {
    this.rule = rule;
    this.moddleRoot = moddleRoot;
    this.reports = [];
    this.report = this.report.bind(this);
  }

  /**
   * @param {Object} report
   * @param {Object} [report.data]
   * @param {Function} [report.fix]
   * @param {string} report.id
   * @param {string} report.message
   * @param {string[]} [report.path]
   */
  report(report) {
    this.reports.push(report);
  }
}

module.exports = function testRule({ moddleRoot, rule }) {
  const reporter = new Reporter({ rule, moddleRoot });

  const check = rule.check;

  const enter = check && check.enter || check;
  const leave = check && check.leave;

  if (!enter && !leave) {
    throw new Error('no check implemented');
  }

  traverse(moddleRoot, {
    enter: enter ? (node) => enter(node, reporter) : null,
    leave: leave ? (node) => leave(node, reporter) : null
  });

  return reporter.reports;
};
