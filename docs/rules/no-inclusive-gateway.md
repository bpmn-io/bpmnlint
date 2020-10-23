# No Inclusive Gateway (no-inclusive-gateway)

Checks for the presence of inclusive gateways. The complex split and join semantics of inclusive gateways make it hard to follow the token flow in bigger diagrams. Furthermore, the inclusive gateway is not well supported by BPMN engines, including [Camunda BPM](https://docs.camunda.org/manual/latest/reference/bpmn20/gateways/inclusive-gateway/#camunda-specific-behavior). In most cases, a combination of exclusive and parallel gateways can express inclusive gateway semantics in a clearer, albeit more verbose manner.

Example of __incorrect__ usage for this rule:

![Incorrect usage example](./examples/no-inclusive-gateway-incorrect.png)

Cf. [`no-inclusive-gateway-incorrect.bpmn`](./examples/no-inclusive-gateway-incorrect.bpmn).


Example of __correct__ usage for this rule:

![Correct usage example](./examples/no-inclusive-gateway-correct.png)

Cf. [`no-inclusive-gateway-correct.bpmn`](./examples/no-inclusive-gateway-correct.bpmn).
