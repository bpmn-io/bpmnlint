# bpmnlint

[![CI](https://github.com/bpmn-io/bpmnlint/workflows/CI/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions?query=workflow%3ACI)

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

Our [documentation](https://github.com/bpmn-io/bpmnlint/tree/master/docs/rules#rules) lists all currenty implemented rules, the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/master/rules) contains each rules implementation.

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


## API

Invoke the tool directly from [NodeJS](https://nodejs.org/en):

```javascript
import Linter from 'bpmnlint';
import NodeResolver from 'bpmnlint/lib/resolver/node-resolver';

import BpmnModdle from 'bpmn-moddle';

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
