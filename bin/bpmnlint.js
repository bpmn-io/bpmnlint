#!/usr/bin/env node

const meow = require("meow");
const fs = require("fs");
const path = require("path");

const linter = require("../lib/linter");

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
    linter(cli.input[0], parsedConfig)
      .then(result => console.log("result: ", result))
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
