# bpmnlint

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Validate your BPMN and DMN diagrams based on configurable lint rules.

| Package | Description |
| --- | --- |
| [`bpmnlint`](./packages/bpmnlint) | Validate your BPMN diagrams based on configurable lint rules. |
| [`dmnlint`](./packages/dmnlint) | Validate your DMN diagrams based on configurable lint rules. |
| [`@bpmn-io/lint-core`](./packages/lint-core) | Shared implementation of both linters. Internal, use `bpmnlint` or `dmnlint` instead. |

## Build and Run

```sh
npm install

# lint and run all tests of all packages
npm run all

# run the tests of a single package
npm run all -w bpmnlint
```

## Releasing

Packages are versioned independently. [`bio-release`](https://github.com/bpmn-io/release)
detects what changed since each package's last release, asks for a bump, then
publishes and tags (`<name>@<version>`):

```sh
npm run release
```

Keep each package's `CHANGELOG.md` up to date before releasing.

## License

MIT
