# Changelog

All notable changes to [dmnlint](https://github.com/bpmn-io/bpmnlint/tree/main/packages/dmnlint) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

* `FEAT`: support globs, `--max-warnings` and `moddleExtensions` in the CLI
* `FEAT`: add `info` reporting category, rule `meta` and rule error reporting
* `FEAT`: expose `dmnlint/lib/linter`, `dmnlint/lib/resolver/*`, `dmnlint/lib/support/compile-config`, `dmnlint/lib/testers/*`, `dmnlint/rules/*` and `dmnlint/config/*` via package `exports`, to support plugins and bundling
* `CHORE`: move to [monorepo](https://github.com/bpmn-io/bpmnlint) and build on top of the internal `@bpmn-io/lint-core`
* `DEPS`: update to `dmn-moddle@12`

### Breaking Changes

* The CLI is now shared with `bpmnlint`: `--init` reports to `stdout`, a missing file path is reported via `stderr`, and the help text changed.
* Files are resolved as globs. A path that does not exist does not fail the command anymore, it is ignored.
* A rule that throws is reported with category `rule-error`. It does not count as an error anymore and does not fail the command.
* `readModdle` and `createModdle` (`dmnlint/lib/testers/helper`) do not return `references` and `elementsById` as part of `context` anymore.

## 1.0.0

* `DEPS`: update to dmn-moddle@9
* `CHORE!`: require node@24

### Breaking Changes

Node 24 is required to use the library. Make sure to update.

## 0.2.0

* `FEAT`: migrate to DMN 1.3

### Breaking Changes

Library was migrated to DMN 1.3. Make sure to migrate your diagrams before linting.

## 0.1.1

* `FIX`: make `no-duplicate-requirements` work for each requirements configuration

## 0.1.0

* `FEAT`: initial version :tada:
