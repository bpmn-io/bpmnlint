# bpmnlint
Linter for BPMN diagrams.

## Installing

```sh
npm install -s bpmnlint
```

Or:

```sh
yarn add bpmnlint
```

## Usage

### As a command line tool
- Make sure to have a **.bpmnlintrc** configuration file in the directory where you are running the tool:

```json
// .bpmnlintrc  file

{
  "label-required": 1,
  "start-event-required": 2,
  "end-event-required": 2
}
```

- Run the following command:
```sh
bpmnlint ./sample.bpmn
```

- Output:
<img src="./output.png" />

### Configuration
The configuration file is a JSON object where the keys represent the rule names and their values provide information about these rules.



### Consuming Rules
To consume built-in rules, it is enough to mention the rule name in the bpmnlint configuration
file. 

Available built-in rules: label-required, start-event-required, and end-event-required.

### Adding Custom Rules 