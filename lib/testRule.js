const traverse = require("./traverse");

class Reporter {
  constructor() {
    this.messages = [];
  }

  report(id, message) {
    this.messages.push({ id, message });
  }
}

module.exports = function testRule(source, rule) {
  const reporter = new Reporter();
  traverse(source, node => rule(node, reporter));
  return reporter.messages;
};
