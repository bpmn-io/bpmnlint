#!/usr/bin/env node
const meow = require("meow");
const fs = require("fs");
const path = require("path");
const { red, yellow, underline } = require("chalk");
const BpmnModdle = require("bpmn-moddle");

const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const linter = require("../lib/linter");

const moddle = new BpmnModdle();

/**
 * Reads XML form path and return moddle object
 * @param {*} sourcePath
 */
async function getModdleRoot(sourcePath) {
  const source = await readFile(path.resolve(sourcePath), "utf-8");
  return new Promise((resolve, reject) => {
    moddle.fromXML(source, (err, root) => {
      if (err) {
        return reject(new Error("failed to parse XML", err));
      }

      return resolve(root);
    });
  });
}

/**
 * @returns a formatted warning message
 */
const logWarning = warning =>
  console.log(
    `${yellow("warning:")} ${underline(warning.node.id)} ${warning.message}`
  );

/**
 * @returns a formatted error message
 */
const logError = error =>
  console.log(`${red("error:")} ${underline(error.node.id)} ${error.message}`);

/**
 *
 * @param {*} errors
 * @param {*} warnings
 */
const logReports = ({ errors, warnings }) => {
  errors.forEach(logError);
  warnings.forEach(logWarning);
};

/**
 * @param {*} errors
 * @param {*} warnings
 */
const fixReports = ({ errors, warnings }) => {
  errors.concat(warnings).forEach(report => {
    report.fix();
  });
};

const cli = meow(
  `
	Usage
	  $ bpmnlint <file.bpmn>

	Options
    --config, -c  Path to configuration file. It overrides .bpmnlintrc if present.
    --fix         Automatically fix fixable errors and warnings

	Examples
		$ bpmnlint ./invoice.bpmn
		
`,
  {
    flags: {
      config: {
        type: "string",
        alias: "c"
      },
      fix: {
        type: "boolean"
      }
    }
  }
);

const { config: configFlag, fix: fixFlag } = cli.flags;

if (cli.input.length !== 1) {
  console.log("Error: bpmn file path missing.");
  process.exit(1);
}

async function handleConfig(config) {
  try {
    const parsedConfig = JSON.parse(config);
    const moddleRoot = await getModdleRoot(cli.input[0]);
    linter({ moddle, moddleRoot, config: parsedConfig })
      .then(reports => {
        fixFlag ? fixReports(reports) : logReports(reports);
      })
      .catch(console.error);
  } catch (e) {
    console.log(`Error parsing the configuration file: ${e}`);
  }
}

if (configFlag) {
  fs.readFile(configFlag, "utf-8", (error, config) => {
    if (error) {
      console.log("Error: couldn't read specified config file.");
      process.exit(1);
    }

    handleConfig(config);
  });
} else {
  fs.readFile(path.resolve(".bpmnlintrc"), "utf-8", (error, config) => {
    if (error) {
      console.log("Error: bpmnlint configuration file missing.");
      process.exit(1);
    }

    handleConfig(config);
  });
}
