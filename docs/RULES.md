# Rules

## Conditional Flows

A rule that checks that sequence flows outgoing from a conditional forking gateway or activity are either default flows _or_ have a condition attached.

> Message: ❌ Sequence flow is missing condition

### Wrong ❌

![Wrong](./conditional-flows-wrong.jpg)

### Right ✔️

![Right](./conditional-flows-right.jpg)

## End Event Required

A rule that checks the presence of an end event per scope.

> Message: ❌ Process is missing end event

### Wrong ❌

![Wrong](./end-event-required-wrong.jpg)

### Right ✔️

![Right](./end-event-required-right.jpg)

## Event Sub Process Typed Start Event

A rule that checks that start events inside an event sub-process are typed.

> Message: ❌ Start event is missing event definition

### Wrong ❌

![Wrong](./event-sub-process-typed-start-event-wrong.jpg)

### Right ✔️

![Right](./event-sub-process-typed-start-event-right.jpg)

## Fake Join

 A rule that checks that no fake join is modeled by attempting to give a task or event join semantics. Users should model a parallel joining gateway to achieve the desired behavior.

 > Message: ⚠️ Incoming flows do not join

### Wrong ⚠️

![Wrong](./fake-join-wrong.jpg)

### Right ✔️

![Right](./fake-join-right.jpg)

## Label Required

A rule that checks the presence of a label.

> Message: ❌ Element is missing label/name

### Wrong ❌

![Wrong](./label-required-wrong.jpg)

### Right ✔️

![Right](./label-required-right.jpg)

## No Complex Gateway

A rule that disallows complex gateways.

> Message: ❌ Element has disallowed type.

### Wrong ❌

![Wrong](./no-complex-gateway-wrong.jpg)

### Right ✔️

![Right](./no-complex-gateway-right.jpg)

## No Disconnected

A rule that verifies that there exists no disconnected flow elements, i.e. elements without incoming _or_ outgoing sequence flows.

> Message: ❌ Element is not connected

### Wrong ❌

![Wrong](./no-disconnected-wrong.jpg)

### Right ✔️

![Right](./no-disconnected-right.jpg)

## No Duplicate Sequence Flows

A rule that verifies that there are no disconnected flow elements, i.e. elements without incoming _or_ outgoing sequence flows.

> Message: ❌ SequenceFlow is a duplicate

### Wrong ❌

![Wrong](./no-duplicate-sequence-flows-wrong.jpg)

### Right ✔️

![Right](./no-duplicate-sequence-flows-right.jpg)

## No Gateway Join Fork

A rule that checks, whether a gateway forks and joins at the same time.

> Message: ❌ Gateway joins and forks

### Wrong ❌

![Wrong](./no-gateway-join-fork-wrong.jpg)

### Right ✔️

![Right](./no-gateway-join-fork-right.jpg)

## No Implicit Split

 A rule that checks that no implicit split is modeled starting from a task. Users should model the parallel splitting gateway explicitly instead.

> Message: ❌ Flow splits implicitly

### Wrong ❌

![Wrong](./no-implicit-split-wrong.jpg)

### Right ✔️

![Right](./no-implicit-split-right.jpg)

## No Inclusive Gateway

A rule that disallows inclusive gateways.

> Message: ❌ Element has disallowed type.

### Wrong ❌

![Wrong](./no-inclusive-gateway-wrong.jpg)

### Right ✔️

![Right](./no-inclusive-gateway-right.jpg)

## Single Blank Start Event

A rule that checks whether not more than one blank start event exists per scope.

> Message: ❌ Process has multiple blank start events.

### Wrong ❌

![Wrong](./single-blank-start-event-wrong.jpg)

### Right ✔️

![Right](./single-blank-start-event-right.jpg)

## Single Event Definition

A rule that verifies that an event contains maximum one event definition.

> Message: ❌ Event has multiple event definitions

### Wrong ❌

![Wrong](./single-event-definition-wrong.jpg)

### Right ✔️

![Right](./single-event-definition-right.jpg)

## Start Event Required

A rule that checks for the presence of a start event per scope.

> Message: ❌ Sub process is missing start event

### Wrong ❌

![Wrong](./start-event-required-wrong.jpg)

### Right ✔️

![Right](./start-event-required-right.jpg)

## Sub Process Blank Start Event

A rule that checks that start events inside a normal sub-processes are blank (do not have an event definition).

> Message: ❌ Start event must be blank

### Wrong ❌

![Wrong](./sub-process-blank-start-event-wrong.jpg)

### Right ✔️

![Right](./start-event-required-right.jpg)