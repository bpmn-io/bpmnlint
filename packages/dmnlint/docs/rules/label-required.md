# Label Required (label-required)

Checks the presence of a label (name) on business knowledge models, decisions, input data and knowledge sources.


Example of __incorrect__ usage for this rule:

```xml
    ...
    <decision id="Decision_1" name="">
      ...
    </decision>
    ...
```


Example of __correct__ usage for this rule:

```xml
    ...
    <decision id="Decision_1" name="Approve invoice">
      ...
    </decision>
    ...
```
