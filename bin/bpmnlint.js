#!/usr/bin/env node
const meow = require('meow');
const fs = require('fs');
const path = require('path');
const { red, yellow, underline } = require('chalk');
const BpmnModdle = require('bpmn-moddle');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const Linter = require('../lib/linter');

const moddle = new BpmnModdle();

const NodeResolver = require('../lib/resolver/nodeResolver');

/**
 * Reads XML form path and return moddle object
 * @param {*} sourcePath
 */
function getModdleFromXML(source) {
  return new Promise((resolve, reject) => {
    moddle.fromXML(source, (err, root) => {
      if (err) {
        return reject(new Error('failed to parse XML', err));
      }

      return resolve(root);
    });
  });
}

/**
 * Logs formatted warning message
 */
const logWarning = warning =>
  console.log(
    `${yellow('warning:')} ${underline(warning.id)} ${warning.message}`
  );

/**
 * Logs a formatted error message
 */
const logError = error =>
  console.log(`${red('error:')} ${underline(error.id)} ${error.message}`);

const logRule = ruleName =>
  console.log(`\nrule: ${ruleName}`);

/**
 * Logs errors and warnings properly in the console
 * @param {*} errors
 * @param {*} warnings
 */
const logReports = (results) => {

  let errorCount = 0;
  let warningCount = 0;

  Object.entries(results).forEach(function([ ruleName, reports ]) {

    logRule(ruleName);

    reports.forEach(function(report) {
      if (report.category === 'error') {
        errorCount++;

        logError(report);
      } else {
        warningCount++;

        logWarning(report);
      }
    });
  });

  console.log(`\nfound ${errorCount} errors and ${warningCount} warnings`);

  if (errorCount > 0) {
    process.exit(1);
  }
};

const cli = meow(
  `
	Usage
	  $ bpmnlint <file.bpmn>

	Options
    --config, -c  Path to configuration file. It overrides .bpmnlintrc if present.

	Examples
		$ bpmnlint ./invoice.bpmn

`,
  {
    flags: {
      config: {
        type: 'string',
        alias: 'c'
      }
    }
  }
);


if (cli.input.length !== 1) {
  console.log('Error: bpmn file path missing.');
  process.exit(1);
}

function logAndExit(...args) {
  console.error(...args);

  process.exit(1);
}

async function handleConfig(config) {
  let parsedConfig;

  try {
    parsedConfig = JSON.parse(config);
  } catch (e) {
    return logAndExit('Error: Could not parse configuration file', e);
  }

  let diagramXML;

  try {
    diagramXML = await readFile(path.resolve(cli.input[0]), 'utf-8');
  } catch (e) {
    return logAndExit(`Error: Failed to read ${cli.input[0]}`, e);
  }

  try {
    const moddleRoot = await getModdleFromXML(diagramXML);

    const linter = new Linter({
      resolver: new NodeResolver()
    });

    const lintResults = await linter.lint(moddleRoot, parsedConfig);

    logReports(lintResults);
  } catch (e) {
    return logAndExit(e);
  }
}

const { config } = cli.flags;

const configPath = config || '.bpmnlintrc';

readFile(configPath, 'utf-8').then(handleConfig, (error) => {

  const message = (
    config
      ? `Error: Could not read ${ config }`
      : `Error: Could not locate configuration`
  );

  logAndExit(message, error);
}).catch(logAndExit);