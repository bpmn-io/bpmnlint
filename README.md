# bpmnlint

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Validate your BPMN and DMN diagrams based on configurable lint rules.

| Package | Description |
| --- | --- |
| [`bpmnlint`](./packages/bpmnlint) | Validate your BPMN diagrams based on configurable lint rules. |
| [`dmnlint`](./packages/dmnlint) | Validate your DMN diagrams based on configurable lint rules. |
| [`@bpmn-io/lint-core`](./packages/lint-core) | Shared implementation of both linters. Internal, use `bpmnlint` or `dmnlint` instead. |
| [`bpmnlint-utils`](./packages/bpmnlint-utils) | Utilities for creating bpmnlint rules, without a dependency on `bpmnlint`. |
| [`dmnlint-utils`](./packages/dmnlint-utils) | Utilities for creating dmnlint rules, without a dependency on `dmnlint`. |

## Build and Run

```sh
npm install

# lint and run all tests of all packages
npm run all

# run the tests of a single package
npm run all -w bpmnlint
```

## Configuration

Both linters are configured via a `.bpmnlintrc` / `.dmnlintrc` file in your working directory. Read about the configuration in the documentation of the respective package:

* [bpmnlint configuration](./packages/bpmnlint#configuration)
* [dmnlint configuration](./packages/dmnlint#configuration)


## Releasing

Packages are versioned independently. [`bio-release`](https://github.com/bpmn-io/release)
detects what changed since each package's last release, asks for a bump, then
publishes and tags (`<name>@<version>`):

```sh
npm run release
```

Packages are located via their `<name>@<version>` tag. The very first release
from this repository has to run `npm run release -- --force-release`, entering
the version `0.1.0` for `@bpmn-io/lint-core` (do not skip it, `bpmnlint` and
`dmnlint` depend on it). Skip the packages that did not change, i.e.
`bpmnlint-utils` and `dmnlint-utils`. Subsequent releases detect changes on
their own.

Keep each package's `CHANGELOG.md` up to date before releasing. Packages that
depend on a released workspace package, such as `bpmnlint` and `dmnlint` on
`@bpmn-io/lint-core`, are released along with it.

## License

MIT
