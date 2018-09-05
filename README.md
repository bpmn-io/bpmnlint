# bpmnlint

[![Build Status](https://travis-ci.org/bpmn-io/bpmnlint.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmnlint)

Validate your BPMN diagrams based on configurable lint rules.


## Usage

Install the utility via [npm](https://www.npmjs.com/package/bpmnlint) and validate your diagrams via the commandline:

```zsh
> bpmnlint diagram.bpmn

rule: bpmnlint/label-required
error: sid-E391B624-F6E8-428B-9C3E-7026F85C4F24 is missing label/name
error: sid-3E1FA189-AC8C-4CF1-9057-3D2EF8C6D3AF is missing label/name
error: sid-DD0BC4E1-4AA3-4835-A477-373EA263A593 is missing label/name
error: sid-B8B18E3A-EF8D-4D19-B5CD-C666D39E2E0D is missing label/name
error: sid-994BB7B0-64D8-4DC4-B549-0758628F5A16 is missing label/name

rule: bpmnlint/no-gateway-join-fork
warn: sid-545B3227-D12A-43A8-B746-55E8C75F3A8A forks and joins
warn: sid-AB73793C-D47A-4738-B34F-A82C6219A92C forks and joins

found 10 errors and 2 warnings
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


## Writing / Consuming Custom Rules

Checkout [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) to learn how to define and consume custom lint rules.


## Visual Linting

Integrate the linter via [bpmn-js-bpmnlint](https://github.com/philippfromme/bpmn-js-bpmnlint) into your [next BPMN editor](https://github.com/bpmn-io/bpmn-js).


## License

MIT
