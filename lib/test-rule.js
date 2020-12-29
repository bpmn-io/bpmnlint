const traverse = require('./traverse');

class Reporter {
  constructor({ moddleRoot, rule }) {
    this.rule = rule;
    this.moddleRoot = moddleRoot;
    this.messages = [];
    this.report = this.report.bind(this);
  }

  report(id, message) {
    this.messages.push({ id, message });
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

  return reporter.messages;
};
