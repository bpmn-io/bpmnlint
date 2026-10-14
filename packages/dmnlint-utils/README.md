# dmnlint-utils

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Utilities for creating dmnlint rules.

## Usage

```javascript
import {
  is,
  isAny
} from 'dmnlint-utils';

is(moddleElement, 'dmn:InputData'); // true || false
isAny(moddleElement, [ 'dmn:Decision', 'dmn:InputData' ]); // true || false
```

## Credits

The project is based on [`bpmnlint-utils`](https://github.com/bpmn-io/bpmnlint-utils) built by [nikku](https://github.com/nikku).

## License

MIT
