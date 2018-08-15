const traverse = require('./traverse');

class Reporter {
  constructor(){
    this.reports = [];
  }

  report(id, report) {
    this.reports.push({id, report});
  }
}


module.exports = function testRule(source, rule) {
  const reporter = new Reporter();
  traverse(source, node => rule(node, reporter));
  return reporter.reports;
}