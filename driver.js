const linter = require('./lib/linter');

const config = {
  "label-required": 2,
  "start-end-events-required": 2
};

linter('./resources/sample.bpmn', config)
.then(result => console.log('result: ', result))
.catch(console.error);