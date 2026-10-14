# @bpmn-io/lint-core

Shared implementation of [bpmnlint](../bpmnlint) and [dmnlint](../dmnlint).

> **This package is an implementation detail.**
> It has no stable API and may change in any release.
> Depend on [`bpmnlint`](../bpmnlint) or [`dmnlint`](../dmnlint) instead.

## How it works

Every module is a factory that is bound to a _product_:

```javascript
const { createLinter } = require('@bpmn-io/lint-core');

const product = {
  name: 'bpmnlint',

  // optional, defaults to `${ name }-plugin-`
  pluginPrefix: 'bpmnlint-plugin-'
};

const Linter = createLinter(product);
```

The product determines

* the package that rules and configurations are loaded from by default (`name`)
* how plugins are named (`pluginPrefix`)

## License

MIT
