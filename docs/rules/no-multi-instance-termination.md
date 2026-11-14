# No Multi-instance Termination (no-multi-instance-termination)

Warns when a terminate end event is used inside a multi-instance subprocess.
The semantics (terminate only the current iteration) are not obvious to non-BPMN experts.

Example of __incorrect__ usage for this rule:

![Terminate event inside a multi-instance subprocess](./examples/no-multi-instance-termination-incorrect.png)

Cf. [`no-multi-instance-termination-incorrect.bpmn`](./examples/no-multi-instance-termination-incorrect.bpmn).

Example of __correct__ usage, canceling all iterations:

![Interrupting escalation boundary event](./examples/no-multi-instance-termination-correct.png)

Cf. [`no-multi-instance-termination-correct.bpmn`](./examples/no-multi-instance-termination-correct.bpmn).

Example of __correct__ usage, canceling one iteration:

![Interrupting escalation event subprocess](./examples/no-multi-instance-termination-event-subprocess-correct.png)

Cf. [`no-multi-instance-termination-event-subprocess-correct.bpmn`](./examples/no-multi-instance-termination-event-subprocess-correct.bpmn).
