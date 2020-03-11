# Gateway One Source Target (superfluous-gateway)

A rule that checks, whether a gateway has only one source and target.  Those gateways are superfluous since they don't do anything.

Example of __incorrect__ usage for this rule:

![Incorrect usage example](./examples/superfluous-gateway-incorrect.png)

Cf. [`superfluous-gateway-incorrect.bpmn`](./examples/superfluous-gateway-incorrect.bpmn).


Example of __correct__ usage for this rule:

![Correct usage example](./examples/superfluous-gateway-correct.png)

Cf. [`superfluous-gateway.bpmn`](./examples/superfluous-gateway.bpmn).