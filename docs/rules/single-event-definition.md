# Single Event Definition (single-event-definition)

Checks that an event contains no more than one event definition.

Example of __incorrect__ usage for this rule:

![Incorrect usage example](./examples/single-event-definition-incorrect.png)

```xml
    ...
    <bpmn:process id="Process_0q7j8eg" isExecutable="true">
      <bpmn:intermediateCatchEvent id="IntermediateEvent_1">
        <bpmn:messageEventDefinition messageRef="Message_1" />
        <bpmn:messageEventDefinition messageRef="Message_2" />
      </bpmn:intermediateCatchEvent>
    </bpmn:process>
    <bpmn:message id="Message_1" name="Message 1" />
    <bpmn:message id="Message_2" name="Message 2" />
    ...
```

Cf. [`single-event-definition-incorrect.bpmn`](./examples/single-event-definition-incorrect.bpmn).

Example of __correct__ usage for this rule:

![Correct usage example](./examples/single-event-definition-correct.png)

```xml
    ...
    <bpmn:process id="Process_0q7j8eg" isExecutable="true">
      <bpmn:intermediateCatchEvent id="IntermediateEvent_1">
        <bpmn:messageEventDefinition messageRef="Message_1" />
      </bpmn:intermediateCatchEvent>
    </bpmn:process>
    <bpmn:message id="Message_1" name="Message 1" />
    ...
```

Cf. [`single-event-definition-correct.bpmn`](./examples/single-event-definition-correct.bpmn).