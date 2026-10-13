# bpmnlint

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Validate your BPMN diagrams based on configurable lint rules.


## Installation

Install the utility via [npm](https://www.npmjs.com/package/bpmnlint):

```sh
npm install -g bpmnlint
```


## Usage

Validate your diagrams via the commandline:

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

Our [documentation](https://github.com/bpmn-io/bpmnlint/tree/main/docs/rules#rules) lists all currenty implemented rules, the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/main/rules) contains each rules implementation.

Do you miss a rule that should be included? [Propose a new rule](https://github.com/bpmn-io/bpmnlint/issues/new?assignees=&labels=rules&template=NEW_RULE.md).


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
    "label-required": "off"
  }
}
```

You may also extend from multiple configurations, including those provided by [custom plug-ins](#writing-a-plug-in):

```json
{
  "extends": [
    "bpmnlint:recommended",
    "plugin:foo/recommended",
    "plugin:@bar/bpmnlint-plugin-bar/recommended"
  ]
}
```

This will amend core `recommended` rules with `recommended` rulesets provided by `bpmnlint-plugin-foo` and `@bar/bpmnlint-plugin-bar`, respectively.

Plug-ins will be resolved relative to the configuration file location, using [node module resolution](https://nodejs.org/api/modules.html#loading-from-node_modules-folders).


### Available Configurations

* [`bpmnlint:all`](./config/all.js) - all rules as errors
* [`bpmnlint:recommended`](./config/recommended.js) - opinionated rules ("best practices") and rules enforcing BPMN compliance
* [`bpmnlint:correctness`](./config/correctness.js) - rules enforcing BPMN compliance

### Moddle extensions

To validate your diagrams with custom [moddle](https://github.com/bpmn-io/moddle) extensions, add `moddleExtensions` to the root configuration file:

```json
{
  "extends": [
    "bpmnlint:recommended",
    "plugin:custom/recommended"
  ],
  "moddleExtensions": {
    "custom": "custom-bpmn-moddle/resources/custom.json"
  }
}
```

The extension will be resolved relative to the configuration file location, using [node module resolution](https://nodejs.org/api/modules.html#loading-from-node_modules-folders).

## API

Invoke the tool directly from [NodeJS](https://nodejs.org/en):

```javascript
import Linter from 'bpmnlint';
import NodeResolver from 'bpmnlint/lib/resolver/node-resolver';

import BpmnModdle from 'bpmn-moddle';

const moddle = new BpmnModdle();

const linter = new Linter({ 
  config: {
    extends: 'bpmnlint:recommended'
  },
  resolver: new NodeResolver()
});

const xmlStr = `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                     id="definitions" 
                     targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="process" />
  </bpmn:definitions>
`;

const {
  rootElement: definitions
} = await moddle.fromXML(xmlStr);

const reports = linter.lint(definitions);

// {
//    "end-event-required": [
//      {
//        "id": "process",
//        "message": "Process is missing end event"
//      }
//    ],
//    ...
// }
```


## Writing a Plug-in

Create your first plug-in using the [plugin creator](https://github.com/nikku/create-bpmnlint-plugin):

```sh
npm init bpmnlint-plugin {PLUGIN_NAME}
```

Checkout the [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) for details on how to define, test, and consume custom lint rules. Use the [bpmnlint playground](https://github.com/bpmn-io/bpmnlint-playground) to implement new rules with quick visual feedback.

> [!NOTE]
> Plug-ins must always follow the naming scheme `bpmnlint-plugin-{NAME_OF_YOUR_PLUGIN}` and may contain a namespace prefix.

When using your custom plug-in, reference its configuration or rules via the shorthand plug-in name, or the full identifier:

```json
{
  "extends": [
    "bpmnlint:recommended",
    "plugin:foo/recommended",
    "plugin:@bar/bpmnlint-plugin-bar/recommended"
  ],
  "rules": {
    "foo/special-rule": "off",
    "@bar/bar/other-rule": "warn"
  }
}
```


## Bundling

For browser usage include your [linting configuration](#configuration) using your favorite bundler plug-in ([Rollup](https://www.npmjs.com/package/rollup-plugin-bpmnlint), [Webpack](https://www.npmjs.com/package/bpmnlint-loader)).


## Visual Feedback

Integrate the linter via [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) into [bpmn-js](https://github.com/bpmn-io/bpmn-js) and get direct feedback during modeling.

To try out visual validation, checkout the [bpmnlint playground](https://github.com/bpmn-io/bpmnlint-playground).


## Related

* [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) - an example plug-in
* [bpmnlint-playground](https://github.com/bpmn-io/bpmnlint-playground) - a playground to implement new rules with quick visual feedback
* [bpmnlint-generate-docs-images](https://github.com/bpmn-io/bpmnlint-generate-docs-images) - Generate images for your bpmnlint documentation
* [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) - integration into [bpmn-js](https://github.com/bpmn-io/bpmn-js)


## License

MIT
