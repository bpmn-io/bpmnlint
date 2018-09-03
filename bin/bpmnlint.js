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
function getModdleFromXML(source) {
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
 * Logs formatted warning message
 */
const logWarning = warning =>
  console.log(
    `${yellow("warning:")} ${underline(warning.id)} ${warning.message}`
  );

/**
 * Logs a formatted error message
 */
const logError = error =>
  console.log(`${red("error:")} ${underline(error.id)} ${error.message}`);

/**
 * Logs errors and warnings properly in the console
 * @param {*} errors
 * @param {*} warnings
 */
const logReports = ({ errors, warnings }) => {
  errors.forEach(logError);
  warnings.forEach(logWarning);
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
        type: "string",
        alias: "c"
      }
    }
  }
);

const { config: configFlag } = cli.flags;

if (cli.input.length !== 1) {
  console.log("Error: bpmn file path missing.");
  process.exit(1);
}

function handleConfig(config) {
  try {
    const parsedConfig = JSON.parse(config);
    readFile(path.resolve(cli.input[0]), "utf-8")
      .then(getModdleFromXML)
      .then(moddleRoot => {
        logReports(linter({ moddleRoot, config: parsedConfig }));
      });
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
