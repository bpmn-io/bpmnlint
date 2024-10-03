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
const { Linter } = require("bpmnlint");
const NodeResolver = require("bpmnlint/lib/resolver/node-resolver");
const BpmnModdle = require('bpmn-moddle');

// Create a moddle instance to work with BPMN XML data
const moddle = new BpmnModdle();

// Initialize the BPMN linter with the recommended configuration and NodeResolver
const linter = new Linter({
    config: {
        extends: 'bpmnlint:recommended'  // Extend the linter configuration using bpmnlint's recommended rules
    },
    resolver: new NodeResolver()
});

// Define a BPMN XML string to be parsed and linted
const xmlStr = `
  <?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_0geryc1">
    <bpmn:participant id="Participant_0ygkg4f" name="Dispatch of goods&#10;Computer Hardware Shop" processRef="Process_1" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:laneSet>
      <bpmn:lane id="Lane_1vl2igx" name="Warehouse">
        <bpmn:flowNodeRef>Task_05ftug5</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:sequenceFlow id="SequenceFlow_06kfaev" sourceRef="ExclusiveGateway_0z5sib0" targetRef="Task_0sl26uo" />
    <bpmn:endEvent id="EndEvent_1fx9yp3" name="Shipment&#10;prepared">
      <bpmn:incoming>SequenceFlow_0v64x8b</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0geryc1">
      <bpmndi:BPMNShape id="Participant_0ygkg4f_di" bpmnElement="Participant_0ygkg4f">
        <dc:Bounds x="252" y="88" width="1260" height="752" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

// Wrap in an async function to use async/await since CommonJS does not allow top-level await
(async () => {
    // Parse the BPMN XML string into a moddle object representing the BPMN structure
    const {
        rootElement: definitions
    } = await moddle.fromXML(xmlStr);

    // Run the linter on the parsed BPMN definitions and retrieve any reports
    const reports = await linter.lint(definitions);

    // Output the linting reports (warnings/errors) to the console
    console.log(reports);

    // {
    //     'no-bpmndi': [
    //     {
    //         id: 'SequenceFlow_06kfaev',
    //         message: 'Element is missing bpmndi',
    //         category: 'error'
    //     },
    //     {
    //         id: 'EndEvent_1fx9yp3',
    //         message: 'Element is missing bpmndi',
    //         category: 'error'
    //     },
    //     ........
    //     ]
    // }

})();
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
