const traverse = require('./traverse');

class Reporter {
  constructor(){
    this.errors = [];
  }

  report(node, error) {
    this.errors.push({node, error});
  }
}


module.exports = function testRule(source, rule) {
  const reporter = new Reporter();
  traverse(source, node => rule(node, reporter));
  return reporter.errors;
}