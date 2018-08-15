const fs = require('fs');
const path = require('path');
const BpmnModdle = require('bpmn-moddle');

const testRule = require('./lib/testRule');
const labelRequired = require('./rules/label-required');

const moddle = new BpmnModdle();
const xml = fs.readFileSync('./resources/sample.bpmn', 'utf-8');


// Testing
moddle.fromXML(xml, function(err, root) {

  if (err) {
    return console.error('failed to parse XML', err);
  }
  
  const errors = testRule(root, labelRequired);
  console.log('errors: ', errors)
});  


