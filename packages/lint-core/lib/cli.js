const { readFile } = require('node:fs/promises');
const { writeFileSync, existsSync } = require('node:fs');
const { resolve: resolvePath } = require('node:path');
const process = require('node:process');

const mri = require('mri');
const colors = require('ansi-colors');

colors.enabled = require('color-support').hasBasic;

const tinyGlob = require('tiny-glob');

const Table = require('cli-table');

const pluralize = require('pluralize');

const { pathStringify } = require('@bpmn-io/moddle-utils');

const { normalizeProduct } = require('./product');

const { createScopedRequire } = require('./resolver/helper');

/**
 * @typedef { import('./types.js').Product } Product
 * @typedef { import('./types.js').ModdleElement } ModdleElement
 * @typedef { Error & { element: ModdleElement } } ImportWarning
 */

const {
  red,
  yellow,
  underline,
  bold,
  magenta
} = colors;

const categoryMap = {
  warn: 'warning'
};


/**
 * Create the command line interface for the given product.
 *
 * @param { {
 *   product: Product,
 *   version: string,
 *   Linter: any,
 *   NodeResolver: any,
 *   createModdle: (extensions: Record<string, any>) => any,
 *   fileType: string,
 *   help: string,
 *   docsUrl: string,
 *   rcFile?: string,
 *   defaultConfig?: string
 * } } options
 *
 * @return { { run: (argv?: string[]) => Promise<void> } }
 */
function createCli(options) {

  const {
    product,
    version,
    Linter,
    NodeResolver,
    createModdle: createProductModdle,
    fileType,
    help,
    docsUrl
  } = options;

  const {
    name
  } = normalizeProduct(product);

  const {
    rcFile = `.${ name }rc`,
    defaultConfig = `${ name }:recommended`
  } = options;

  const defaultConfigContents = `{
  "extends": "${ defaultConfig }"
}`;


  /**
   * Reads XML form path and return moddle object
   *
   * @param { string } diagramXML
   * @param { any } moddle
   *
   * @return { Promise<{ moddleElement?: any; warnings: Error[], error?: Error }> } parseResult
   */
  async function parseDiagram(diagramXML, moddle) {

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

  async function lintDiagram(diagramPath, config, moddle) {

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
    } = await parseDiagram(diagramXML, moddle);

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
        } = /** @type { ImportWarning } */ (warning);

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

    const moddle = createModdle(config);

    for (let i = 0; i < files.length; i++) {
      let results = await lintDiagram(files[i], config, moddle);

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

  /**
   * Create moddle instance with extensions from the config.
   *
   * @param { any } config
   *
   * @return { any }
   */
  function createModdle(config) {
    const scopedRequire = createScopedRequire(process.cwd());

    const options = config.moddleExtensions || {};

    for (const key in options) {
      const extension = options[key];

      try {
        options[key] = scopedRequire(extension);
      } catch (error) {
        errorAndExit('Error: Could not load moddle extension <%s> from %s\n\n', key, extension, /** @type { Error } */ (error).message);
      }
    }

    try {
      return createProductModdle(options);
    } catch (error) {
      errorAndExit('Error: Could not create moddle instance\n\n%s', /** @type { Error } */ (error).message);
    }
  }

  async function run(argv = process.argv.slice(2)) {

    const {
      help: showHelp,
      init,
      version: showVersion,
      config: configOverridePath,
      'max-warnings': maxWarnings,
      _: files
    } = mri(argv, {
      string: [ 'config' ],
      alias: {
        c: 'config'
      },
      default: {
        'max-warnings': -1
      }
    });

    if (showVersion) {
      return showVersionAndExit(version);
    }

    if (showHelp) {
      return infoAndExit(help);
    }

    if (init) {
      if (existsSync(rcFile)) {
        throw errorAndExit(`Not overriding existing ${ rcFile }`);
      }

      writeFileSync(rcFile, defaultConfigContents, 'utf8');

      throw infoAndExit(`Created ${magenta(rcFile)} file`);
    }

    if (files.length === 0) {
      throw errorAndExit(`Error: ${ fileType } file path missing`);
    }

    const configPath = configOverridePath || rcFile;

    let configString, config;

    try {
      configString = await readFile(configPath, 'utf-8');
    } catch (error) {

      const message = (
        configOverridePath
          ? `Error: Could not read ${ magenta(configOverridePath) }`
          : `Error: Could not locate local ${ magenta(rcFile) } file. Create one via

  ${magenta(`${ name } --init`)}

Learn more about configuring ${ name }: ${ docsUrl }`
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

  return {
    run: (argv) => run(argv).catch(errorAndExit)
  };
}

module.exports = {
  createCli
};


// helpers ///////////////////////////

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

function showVersionAndExit(version) {
  console.log(version);

  process.exit(0);
}

function infoAndExit(...args) {
  console.log(...args);

  process.exit(0);
}
