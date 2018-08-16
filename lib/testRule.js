const traverse = require("./traverse");

const emptyFun = () => {};
class Reporter {
  constructor({ moddle, moddleRoot, rule }) {
    this.rule = rule;
    this.moddle = moddle;
    this.moddleRoot = moddleRoot;
    this.messages = [];
    this.report = this.report.bind(this);
  }

  report(node, message) {
    this.messages.push({
      node,
      message,
      fix: () =>
        (this.rule.fix || emptyFun)({
          node,
          moddle: this.moddle,
          moddleRoot: this.moddleRoot
        })
    });
  }
}

module.exports = function testRule({ moddle, moddleRoot, rule }) {
  const reporter = new Reporter({ rule, moddle, moddleRoot });
  traverse(moddleRoot, node => rule.check(node, reporter));
  return reporter.messages;
};
