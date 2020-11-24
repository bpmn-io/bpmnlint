#!/usr/bin/env node
const mri = require('mri');
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');

colors.enabled = require('color-support').hasBasic;

const {
  red,
  yellow,
  underline,
  bold,
  magenta
} = colors;

const { promisify } = require('util');

const tinyGlob = require('tiny-glob');
const readFile = promisify(fs.readFile);

const BpmnModdle = require('bpmn-moddle');

const Linter = require('../lib/linter');
const NodeResolver = require('../lib/resolver/node-resolver');

const Table = require('cli-table');

const pluralize = require('pluralize');

const CONFIG_NAME = '.bpmnlintrc';

const DEFAULT_CONFIG_CONTENTS = `{
  "extends": "bpmnlint:recommended"
}`;

const HELP_STRING = `
Usage
    $ bpmnlint diagram.bpmn

  Options
    --config, -c  Path to configuration file. It overrides .bpmnlintrc if present.
    --init        Generate a .bpmnlintrc file in the current working directory

  Examples
    $ bpmnlint ./invoice.bpmn
    $ bpmnlint --init

`;


const moddle = new BpmnModdle();

function boldRed(str) {
  return bold(red(str));
}

function boldYellow(str) {
  return bold(yellow(str));
}

function glob(files) {
  return Promise.all(
    files.map(
      file => tinyGlob(file, { dot: true })
    )
  ).then(files => [].concat(...files));
}

/**
 * Reads XML form path and return moddle object
 *
 * @param {string} diagramXML
 *
 * @return { { rootElement: any; warnings: Error[], error?: Error } } parseResult
 */
async function parseDiagram(diagramXML) {

  try {
    const {
      rootElement: moddleElement,
      warnings = []
    } = await moddle.fromXML(diagramXML);

    return {
      moddleElement,
      warnings
    };
  } catch (error) {

    const {
      warnings = []
    } = error;

    return {
      error,
      warnings
    };
  }
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

  return [ report.id || '', color(categoryMap[category] || category), report.message, report.name || '' ];
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

function errorAndExit(...args) {
  console.error(...args);

  process.exit(1);
}

function infoAndExit(...args) {
  console.log(...args);

  process.exit(0);
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
        message,
        name: reportName
      } = report;

      table.push(tableEntry({
        category,
        id,
        message,
        name: reportName || name
      }));

      if (category === 'error') {
        errorCount++;
      } else {
        warningCount++;
      }
    });
  });

  const problemCount = warningCount + errorCount;

  if (problemCount) {
    console.log();
    console.log(underline(path.resolve(filePath)));
    console.log(table.toString());
  }

  return {
    errorCount,
    warningCount
  };
}

async function lintDiagram(diagramPath, config) {

  let diagramXML;

  try {
    diagramXML = await readFile(path.resolve(diagramPath), 'utf-8');
  } catch (error) {
    return errorAndExit(`Error: Failed to read ${diagramPath}\n\n%s`, error.message);
  }


  const {
    error: importError,
    warnings: importWarnings,
    moddleElement
  } = await parseDiagram(diagramXML);

  if (importError) {
    return printReports(diagramPath, {
      '': [
        {
          message: 'Parse error: ' + importError.message,
          category: 'error'
        }
      ]
    });
  }

  const importReports = importWarnings.length ? {
    '': importWarnings.map(function(warning) {

      const {
        element,
        message
      } = warning;

      const id = element && element.id;

      return {
        id,
        message: 'Import warning: ' + message.split(/\n/)[0],
        category: 'error'
      };
    })
  } : {};

  try {
    const linter = new Linter({
      config,
      resolver: new NodeResolver()
    });

    const lintReports = await linter.lint(moddleElement);

    const allResults = {
      ...importReports,
      ...lintReports
    };

    return printReports(diagramPath, allResults);
  } catch (e) {
    return errorAndExit(e);
  }
}

async function lint(files, config) {

  let errorCount = 0;
  let warningCount = 0;

  console.log();

  for (let i = 0; i < files.length; i++) {
    let results = await lintDiagram(files[i], config);

    errorCount += results.errorCount;
    warningCount += results.warningCount;
  }

  const problemCount = errorCount + warningCount;

  let color;

  if (warningCount) {
    color = boldYellow;
  }

  if (errorCount) {
    color = boldRed;
  }

  if (problemCount) {
    console.log();
    console.log(color(
      `✖ ${problemCount} ${pluralize('problem', problemCount)} (${errorCount} ${pluralize('error', errorCount)}, ${warningCount} ${pluralize('warning', warningCount)})`
    ));
  }

  if (errorCount) {
    process.exit(1);
  }

}

async function run() {

  const {
    help,
    init,
    config: configOverridePath,
    _: files
  } = mri(process.argv.slice(2), {
    string: [ 'config' ],
    alias: {
      c: 'config'
    }
  });

  if (help) {
    return infoAndExit(HELP_STRING);
  }

  if (init) {
    if (fs.existsSync(CONFIG_NAME)) {
      return errorAndExit('Not overriding existing .bpmnlintrc');
    }

    fs.writeFileSync(CONFIG_NAME, DEFAULT_CONFIG_CONTENTS, 'utf8');

    return infoAndExit(`Created ${magenta(CONFIG_NAME)} file`);
  }

  if (files.length === 0) {
    return errorAndExit('Error: bpmn file path missing');
  }

  const configPath = configOverridePath || CONFIG_NAME;

  let configString, config;

  try {
    configString = await readFile(configPath, 'utf-8');
  } catch (error) {

    const message = (
      configOverridePath
        ? `Error: Could not read ${ magenta(configOverridePath) }`
        : `Error: Could not locate local ${ magenta(CONFIG_NAME) } file. Create one via

  ${magenta('bpmnlint --init')}

Learn more about configuring bpmnlint: https://github.com/bpmn-io/bpmnlint#configuration`
    );

    return errorAndExit(message);
  }

  try {
    config = JSON.parse(configString);
  } catch (err) {
    return errorAndExit('Error: Could not parse %s\n\n%s', configPath, err.message);
  }

  const actualFiles = await glob(files);

  return lint(actualFiles, config);
}

run().catch(errorAndExit);