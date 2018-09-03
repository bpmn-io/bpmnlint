# bpmnlint

[![Build Status](https://travis-ci.org/bpmn-io/bpmnlint.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmnlint)

Validate your BPMN diagrams based configurable lint rules.


## Usage

Install the utility via [npm](https://www.npmjs.com/package/bpmnlint) and validate your diagrams via the commandline:

```bash
> bpmnlint diagram.bpmn

error: Process_1 is missing a Start Event
error: Process_1 is missing an End Event
```


## Rule Configuration

Create a `.bpmnlintrc` file in your working directory:

```json
{
  "extends": "bpmnlint:recommended"
}
```

Add or customize rules using the `rules` block:

```json
{
  "extends": "bpmnlint:recommended",
  "rules": {
    "label-required": "off"
  }
}
```


## Visual Linting

Checkout [bpmn-js-bpmnlint](https://github.com/philippfromme/bpmn-js-bpmnlint) to learn how to add visual linting to your [next BPMN editor](https://github.com/bpmn-io/bpmn-js).


## License

MIT
