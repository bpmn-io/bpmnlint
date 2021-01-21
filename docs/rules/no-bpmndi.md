# No BPMNDI information (no-bpmndi)

Checks for missing BPMNDI information for BPMN elements, which should have a visual representation.

Each BPMN element (which requires a visual representation) is referenced by a BPMNDI element, which defines how to visually display / render the respective element. It might happen, that a user deletes such an BPMNDI element by accident (e.g., by working in the XML directly). This might lead to errors, since the BPMN element would still be interpreted when executing the process, but it would not be visible anymore in graphical modeling tools. This rule identifies these cases.

Example of __incorrect__ usage for this rule. See `task1`:

```xml
<bpmn:process id="Process_0unw6ak" isExecutable="true">
  <bpmn:task id="task1" />
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0unw6ak">
  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```


Example of __correct__ usage for this rule:

```xml
<bpmn:process id="Process_0unw6ak" isExecutable="true">
  <bpmn:task id="task1" />
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
  <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0unw6ak">
    <bpmndi:BPMNShape id="Activity_1r7w5u9_di" bpmnElement="task1">
      <dc:Bounds x="160" y="77" width="100" height="80" />
    </bpmndi:BPMNShape>
  </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```
