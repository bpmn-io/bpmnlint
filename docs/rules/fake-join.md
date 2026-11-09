# Fake Join (fake-join)

Checks that no fake join is modeled by attempting to give a task or event join semantics. Users should model a parallel joining gateway to achieve the desired behavior.

The rule also reports a link catch event that multiple link throw events with the same link name target within the same scope. Like multiple incoming sequence flows, the catch event does not synchronize the paths: each arrival continues independently, and the downstream flow may execute multiple times. Many-to-one links are valid BPMN and are not reported by [`link-event`](./link-event.md).

Note that static convergence alone does not establish that the paths run concurrently. Mutually exclusive paths are legitimate, and so is an explicit exclusive merge, which behaves the same way. Replacing the convergence with a synchronizing gateway is not a behavior-preserving fix in general.


Example of __incorrect__ usage for this rule:

![Incorrect usage example](./examples/fake-join-incorrect.png)

```xml
    ...
    <bpmn:task id="Task_2">
      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_2</bpmn:incoming>
    </bpmn:task>
    ...
```

Cf. [`fake-join-incorrect.bpmn`](./examples/fake-join-incorrect.bpmn).


Example of __correct__ usage for this rule:

![Correct usage example](./examples/fake-join-correct.png)

```xml
    ...
    <bpmn:task id="Task_2">
      <bpmn:incoming>SequenceFlow_1</bpmn:incoming>
    </bpmn:task>
    ...
```

Cf. [`fake-join-correct.bpmn`](./examples/fake-join-correct.bpmn).


Example of __incorrect__ usage for this rule (link events):

```xml
    ...
    <bpmn:intermediateThrowEvent id="Throw_1">
      <bpmn:linkEventDefinition name="L" />
    </bpmn:intermediateThrowEvent>
    <bpmn:intermediateThrowEvent id="Throw_2">
      <bpmn:linkEventDefinition name="L" />
    </bpmn:intermediateThrowEvent>
    <bpmn:intermediateCatchEvent id="Catch">
      <bpmn:linkEventDefinition name="L" />
    </bpmn:intermediateCatchEvent>
    ...
```
