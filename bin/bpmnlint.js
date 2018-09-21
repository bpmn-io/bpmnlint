#!/usr/bin/env node
const meow = require('meow');
const fs = require('fs');
const path = require('path');
const { red, yellow, underline, bold } = require('chalk');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const BpmnModdle = require('bpmn-moddle');

const Linter = require('../lib/linter');
const NodeResolver = require('../lib/resolver/node-resolver');

const Table = require('cli-table');

const pluralize = require('pluralize');

const moddle = new BpmnModdle();

function boldRed(str) {
  return bold(red(str));
}

function boldYellow(str) {
  return bold(yellow(str));
}

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

const categoryMap = {
  warn: 'warning'
};

/**
 * Logs a formatted  message
 */
function tableEntry(report) {
  const category = report.category;

  const color = category === 'error' ? red : yellow;

  return [ report.id, color(categoryMap[category] || category), report.message, report.name ];
}

function createTable() {
  return new Table({
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '  ',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': '  '
    },
    style: {
      'padding-left': 0,
      'padding-right': 0
    }
  });
}


/**
 * Prints lint results to the console
 *
 * @param {String} filePath
 * @param {Object} results
 */
function printReports(filePath, results) {

  let errorCount = 0;
  let warningCount = 0;

  const table = createTable();

  Object.entries(results).forEach(function([ name, reports ]) {

    reports.forEach(function(report) {

      const {
        category,
        id,
        message
      } = report;

      table.push(tableEntry({
        category,
        id,
        message,
        name
      }));

      if (category === 'error') {
        errorCount++;
      } else {
        warningCount++;
      }
    });
  });

  let color;

  const problemCount = warningCount + errorCount;

  if (warningCount) {
    color = boldYellow;
  }

  if (errorCount) {
    color = boldRed;
  }

  if (problemCount) {
    console.log();
    console.log();
    console.log(underline(path.resolve(filePath)));
    console.log(table.toString());
    console.log();
    console.log(color(
      `✖ ${problemCount} ${pluralize('problem', problemCount)} (${errorCount} ${pluralize('error', errorCount)}, ${warningCount} ${pluralize('warning', warningCount)})`
    ));
  }

  return errorCount;
}

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

async function handleConfig(configString) {

  const inputFile = cli.input[0];

  let config;

  try {
    config = JSON.parse(configString);
  } catch (e) {
    return logAndExit('Error: Could not parse configuration file', e);
  }

  let diagramXML;

  try {
    diagramXML = await readFile(path.resolve(inputFile), 'utf-8');
  } catch (e) {
    return logAndExit(`Error: Failed to read ${inputFile}`, e);
  }

  try {
    const moddleRoot = await getModdleFromXML(diagramXML);

    const linter = new Linter({
      config,
      resolver: new NodeResolver()
    });

    const lintResults = await linter.lint(moddleRoot);

    const withErrors = printReports(inputFile, lintResults);

    if (withErrors) {
      process.exit(1);
    }
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
      : 'Error: Could not locate configuration'
  );

  logAndExit(message, error);
}).catch(logAndExit);