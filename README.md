# bpmnlint

[![Build Status](https://travis-ci.org/bpmn-io/bpmnlint.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmnlint)

Validate and improve your BPMN diagrams.


## Installing

```sh
npm install -s bpmnlint
```

Or:

```sh
yarn add bpmnlint
```

## Usage

### As a command line tool
#### Using a local **.bpmnlintrc** configuration file
- Make sure to have a **.bpmnlintrc** configuration file in the directory where you are running the tool:

```json
// .bpmnlintrc  file
{
  "rules": {
    "label-required": "warn",
    "start-event-required": "error",
    "end-event-required": "error"
  }
}
```

- Run the following command:
```sh
bpmnlint ./sample.bpmn
```

#### Using an explicit configuration file
- e.g.
```json
// some-config.json file
{
  "rules": {
    "label-required": "warn",
    "start-event-required": "error",
    "end-event-required": "error"
  }
}
```

- Run the following command:
```sh
bpmnlint ./sample.bpmn -c some-config.json
```
or
```sh
bpmnlint ./sample.bpmn --config some-config.json
```

> **Note:** For more information about the possible flags, run bpmnlint with the --help flag.

#### Output:
<img src="./output.png" />

### Configuration
The configuration file is a JSON object where the keys represent the rule names and their values provide information about these rules.

These values can be specified in an implicit or explicit way.

> **Note:** bpmnlint comes with a list of built-in rules: label-required, start-event-required, and end-event-required.

### Implicit Configuration
If the specified value for a rule is a number, it will hold the rule status flag:
- 0: the rule is off
- 1: problems reported by the rule are considered as warnings
- 2: problems reported by the rule are considerd as errors

```json
{
  "rules": {
    "label-required": "warn"
  }
}
```

bpmnlint will then look for the rule first in the built-in rules.
If not found, bpmnlint will look for the rule in the npm packages installed as **bpmn-**rule-name (e.g. bpmn-no-implicit-parallel-gateway).

> **Important:** if you're referring to a non built-in rule, make sure to have it installed as an npm dependency.

### Explicit Configuration
If the specified value for a rule is an object, it will hold the following information:
- path to the the rule.
- flag: rule status flag

```json
{
  "plugins": [
    "custom-rules"
  ],
  "rules": {
    "custom-rules/some-custom-rule": "error"
  }
}
```

### Adding Custom Rules
> **Important:** The rule needs to have a suffix of 'bpmnlint-'.

Custom rules can be added in two ways:

#### As an NPM Module
Please check out the example of [no-implicit-parallel-gateway](https://github.com/siffogh/bpmnlint-no-implicit-parallel-gateway)

#### As a Local Module
```json
{
  "plugins": [
    "custom-rules"
  ],
  "rules": {
    "custom-rules/some-custom-rule": "error"
  }
}
```

### As a Visual Linting Tool

Please check out [bpmn-js-bpmnlint](https://github.com/philippfromme/bpmn-js-bpmnlint).