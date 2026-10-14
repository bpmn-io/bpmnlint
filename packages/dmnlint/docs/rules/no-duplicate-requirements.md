# No Duplicate Requirements (no-duplicate-requirements)

Checks that there is at most one requirement between two elements, i.e. two or more information, knowledge or authority requirements from the same source to the same target.

Both the source (_duplicate outgoing requirements_) and the target (_duplicate incoming requirements_) are reported.


Example of __incorrect__ usage for this rule:

```xml
    ...
    <decision id="Decision_1" name="Decision">
      <informationRequirement id="InformationRequirement_1">
        <requiredInput href="#InputData_1" />
      </informationRequirement>
      <informationRequirement id="InformationRequirement_2">
        <requiredInput href="#InputData_1" />
      </informationRequirement>
    </decision>
    <inputData id="InputData_1" name="Input" />
    ...
```


Example of __correct__ usage for this rule:

```xml
    ...
    <decision id="Decision_1" name="Decision">
      <informationRequirement id="InformationRequirement_1">
        <requiredInput href="#InputData_1" />
      </informationRequirement>
    </decision>
    <inputData id="InputData_1" name="Input" />
    ...
```
