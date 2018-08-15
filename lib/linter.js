const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const BpmnModdle = require('bpmn-moddle');

const testRule = require('./testRule');
const labelRequired = require('../rules/label-required');
const startEndEventsRequired = require('../rules/start-end-events-required');

const moddle = new BpmnModdle();


// const xml = fs.readFileSync('./resources/sample.bpmn', 'utf-8');


// // Testing
// moddle.fromXML(xml, function(err, root) {

//   if (err) {
//     return console.error('failed to parse XML', err);
//   }
  
//   const errors = testRule(root, startEndEventsRequired);
//   console.log('errors: ', errors)
// });  

const flagsMap = {
  1: 'warnings',
  2: 'errors'
};


function applyRule(source, ruleName, ruleFlagIdx, totalReport) {
  const rule = require(`../rules/${ruleName}`);
  return new Promise((resolve, reject) => {
    if(!Boolean(ruleFlagIdx)) {
      return resolve([]);
    }

    moddle.fromXML(source, function(err, root) {

      if (err) {
        return reject('failed to parse XML', err);
      }
      
      const reports = testRule(root, rule);
      const flagName = flagsMap[ruleFlagIdx];
      totalReport[flagName] =  (totalReport[flagName] || []).concat(reports);
      return resolve();
    });  
  });
}

module.exports = async function linter(sourcePath, config) {
   const source = await readFile(path.resolve(sourcePath), 'utf-8');
   const totalReport = {warnings: [], errors: []};
   const rulesApplications = Object.entries(config).map(([ruleName, ruleFlagIdx]) => {
      return applyRule(source, ruleName, ruleFlagIdx, totalReport);
   });

   await Promise.all(rulesApplications);
   return totalReport;
}