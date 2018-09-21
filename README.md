# bpmnlint

[![Build Status](https://travis-ci.org/bpmn-io/bpmnlint.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmnlint)

Validate your BPMN diagrams based on configurable lint rules.


## Usage

Install the utility via [npm](https://www.npmjs.com/package/bpmnlint) and validate your diagrams via the commandline:

```sh
> bpmnlint invoice.bpmn

/Projects/process-application/resources/invoice.bpmn
  Flow_1    error    Sequence flow is missing condition  conditional-flows
  Process   error    Process is missing end event        end-event-required
  Task_13   warning  Element is missing label/name       label-required
  Event_12  warning  Element is missing label/name       label-required
  Event_27  warning  Element is missing label/name       label-required
  Process   error    Process is missing start event      start-event-required

✖ 6 problems (6 errors, 0 warnings)
```


## Rules

Checkout the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/master/rules) for the list of existing rules.


## Configuration

Create a `.bpmnlintrc` file in your working directory and inherit from a common configuration using the `extends` block:

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
    "bpmnlint/label-required": "off"
  }
}
```


## Writing / Consuming Custom Rules

Checkout [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) to learn how to define and consume custom lint rules.


## Visual Linting

Integrate the linter via [bpmn-js-bpmnlint](https://github.com/philippfromme/bpmn-js-bpmnlint) into your [next BPMN editor](https://github.com/bpmn-io/bpmn-js).


## License

MIT
