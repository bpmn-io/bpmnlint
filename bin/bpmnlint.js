#!/usr/bin/env node

const { readFile } = require('node:fs/promises');
const { writeFileSync, existsSync } = require('node:fs');
const { resolve: resolvePath } = require('node:path');

const mri = require('mri');
const colors = require('ansi-colors');

colors.enabled = require('color-support').hasBasic;

const {
  red,
  yellow,
  underline,
  bold,
  magenta
} = colors;

const tinyGlob = require('tiny-glob');

// @ts-expect-error 'missing <bpmn-moddle> types'
const BpmnModdle = require('bpmn-moddle');

const Linter = require('../lib/linter');
const NodeResolver = require('../lib/resolver/node-resolver');

const Table = require('cli-table');

const pluralize = require('pluralize');

const { pathStringify } = require('@bpmn-io/moddle-utils');

/**
 * @typedef { import('../lib/types').ModdleElement } ModdleElement
 * @typedef { Error & { element: ModdleElement } } BPMNImportWarning
 */

const CONFIG_NAME = '.bpmnlintrc';

const DEFAULT_CONFIG_CONTENTS = `{
  "extends": "bpmnlint:recommended"
}`;

const HELP_STRING = `
Usage
    $ bpmnlint diagram.bpmn

  Options
    --config, -c    Path to configuration file. It overrides .bpmnlintrc if present
    --init          Generate a .bpmnlintrc file in the current working directory
    --max-warnings  Number of warnings to trigger nonzero exit code - default: -1

  Examples
    $ bpmnlint ./invoice.bpmn
    $ bpmnlint --max-warnings=0 '*.bpmn'
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
 * @return { Promise<{ moddleElement: any; warnings: Error[], error?: Error }> } parseResult
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

      // @ts-expect-error
      warnings = []
    } = error;

    return {

      // @ts-expect-error
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
  let {
    category,
    id = '',
    message,
    name = '',
    path
  } = report;

  if (path) {
    id = `${ id }#${ pathStringify(path) }`;
  }

  const color = category === 'error' ? red : yellow;

  return [ id, color(categoryMap[ category ] || category), message, name ];
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

function showVersionAndExit() {
  console.log(require('../package.json').version);

  process.exit(0);
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
    console.log(underline(resolvePath(filePath)));
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
    diagramXML = await readFile(resolvePath(diagramPath), 'utf-8');
  } catch (error) {
    throw errorAndExit(`Error: Failed to read ${diagramPath}\n\n%s`, /** @type { Error } */ (error).message);
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
      } = /** @type { BPMNImportWarning } */ (warning);

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
    throw errorAndExit(e);
  }
}

async function lint(files, config, maxWarnings) {

  let errorCount = 0;
  let warningCount = 0;

  console.log();

  for (let i = 0; i < files.length; i++) {
    let results = await lintDiagram(files[i], config);

    errorCount += results.errorCount;
    warningCount += results.warningCount;
  }

  const problemCount = errorCount + warningCount;

  if (problemCount) {

    const color = warningCount ? boldYellow : boldRed;

    console.log();
    console.log(color(
      `✖ ${problemCount} ${pluralize('problem', problemCount)} (${errorCount} ${pluralize('error', errorCount)}, ${warningCount} ${pluralize('warning', warningCount)})`
    ));
  }

  if (errorCount || (maxWarnings !== -1 && warningCount > maxWarnings)) {
    process.exit(1);
  }

}

async function run() {

  const {
    help,
    init,
    version,
    config: configOverridePath,
    'max-warnings': maxWarnings,
    _: files
  } = mri(process.argv.slice(2), {
    string: [ 'config' ],
    alias: {
      c: 'config'
    },
    default: {
      'max-warnings': -1
    }
  });

  if (version) {
    return showVersionAndExit();
  }

  if (help) {
    return infoAndExit(HELP_STRING);
  }

  if (init) {
    if (existsSync(CONFIG_NAME)) {
      throw errorAndExit('Not overriding existing .bpmnlintrc');
    }

    writeFileSync(CONFIG_NAME, DEFAULT_CONFIG_CONTENTS, 'utf8');

    throw infoAndExit(`Created ${magenta(CONFIG_NAME)} file`);
  }

  if (files.length === 0) {
    throw errorAndExit('Error: bpmn file path missing');
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

    throw errorAndExit(message);
  }

  try {
    config = JSON.parse(configString);
  } catch (error) {
    throw errorAndExit('Error: Could not parse %s\n\n%s', configPath, /** @type { Error } */ (error).message);
  }

  const actualFiles = await glob(files);

  return lint(actualFiles, config, maxWarnings);
}

run().catch(errorAndExit);