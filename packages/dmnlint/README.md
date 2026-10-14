# dmnlint

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Validate your DMN diagrams based on configurable lint rules.

## Usage

Install the utility via [npm](https://www.npmjs.com/package/dmnlint):

```sh
npm install -g dmnlint
```

Validate your diagrams via the command line:

```sh
> dmnlint invoice.dmn

/Projects/process-application/resources/invoice.dmn
  InputData_13   error  Element is missing label/name       label-required
  Decision_12    error  Element is missing label/name       label-required

✖ 2 problems (2 errors, 0 warnings)
```

Pass multiple files or a glob, and use `--max-warnings` to fail on warnings:

```sh
> dmnlint --max-warnings=0 '*.dmn'
```

Requires Node.js 24 or newer.

## Rules

Our [documentation](https://github.com/bpmn-io/bpmnlint/tree/main/packages/dmnlint/docs/rules#rules) lists all currently implemented rules, the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/main/packages/dmnlint/rules) contains each rules implementation.

Do you miss a rule that should be included? [Propose a new rule](https://github.com/bpmn-io/bpmnlint/issues/new?template=NEW_RULE.md).

## Configuration

Create a `.dmnlintrc` file in your working directory and inherit from a common configuration using the `extends` block:

```json
{
  "extends": "dmnlint:recommended"
}
```

Add or customize rules using the `rules` block:

```json
{
  "extends": "dmnlint:recommended",
  "rules": {
    "label-required": "off"
  }
}
```

Run `dmnlint --init` to create a default `.dmnlintrc`.

## Writing Custom Rules

Rules are plain functions that check elements of the diagram. Use `is` and `isAny` from [`dmnlint-utils`](https://github.com/bpmn-io/bpmnlint/tree/main/packages/dmnlint-utils) to check the type of an element:

```javascript
const { is } = require('dmnlint-utils');

module.exports = function() {

  function check(node, reporter) {

    if (is(node, 'Decision') && !node.name) {
      reporter.report(node.id, 'Decision is missing a name');
    }
  }

  return { check };
};
```

Types without a namespace prefix are looked up in the `dmn` namespace. Test rules via `dmnlint/lib/testers/rule-tester`:

```javascript
const RuleTester = require('dmnlint/lib/testers/rule-tester');
const { readModdle } = require('dmnlint/lib/testers/helper');

RuleTester.verify('decision-name', rule, {
  valid: [ { moddleElement: readModdle('valid.dmn') } ],
  invalid: [ { moddleElement: readModdle('invalid.dmn'), report: { id: 'Decision_1', message: 'Decision is missing a name' } } ]
});
```

## Credits

The project is based on [`bpmnlint`](https://github.com/bpmn-io/bpmnlint) built by [nikku](https://github.com/nikku) and [siffogh](https://github.com/siffogh).

## License

MIT
