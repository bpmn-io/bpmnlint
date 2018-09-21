# Changelog

All notable changes to [bpmnlint](https://github.com/bpmn-io/bpmnlint) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 3.2.1

* `DOCS`: fix readme code snippet

## 3.2.0

* `FEAT`: add ability to pass linter configuration via constructor

## 3.1.0

* `FEAT`: add support script to compile `.bpmnlintrc` files to JavaScript ([`cf53a389`](https://github.com/bpmn-io/bpmnlint/commit/cf53a3894b6bd821e18ddfc7bdaa8da857356a37))

## 3.0.0

#### Breaking Changes

* `FEAT`: treat unprefixed rules as built-in ones

## 2.0.0

#### Breaking Changes

* `CHORE`: make `NodeResolver` a constructor
* `CHORE`: unify file names to `dashed-case`
* `CHORE`: rework `Resolver` APIs

#### Other Enhancements

* `FEAT`: add `StaticResolver` to load cached resources
* `FEAT`: add `{ Linter }` as a library export
* `CHORE`: move rule and config name resolution to linter
* `CHORE`: catch all cli errors and exit accordingly

## 1.0.0

* `FEAT`: add numerous new rules ([#5](https://github.com/bpmn-io/bpmnlint/issues/5))
* `FEAT`: add `bpmnlint:all` configuration
* `FEAT`: improve `label-required` rule ([#11](https://github.com/bpmn-io/bpmnlint/issues/11))
* `FEAT`: group lint results by rule names
* `FEAT`: exit cli with code=1 on lint errors
* `FEAT`: add `isAny(node, [ ... types ])` method to `utils`
* `CHORE`: improve / test cover existing rules
* `CHORE`: include new rules in `bpmnlint:recommended` configuration

## 1.0.0-alpha6

* `DOCS`: documentation simplification / improvements

## 1.0.0-alpha5

_Initial stable release._

* `FEAT`: configure, resolve and execute local and external rules
* `FEAT`: extend external configuration via `extends`
* `FEAT`: make rule and configuration resolution async
* `FEAT`: provide `bpmnlint:recommended` configuration
* `CHORE`: `linter` is now a constructor, offering a `#lint(moddleElement, config)` method
* `CHORE`: moved library to [bpmn-io/bpmnlinter](https://github.com/bpmn-io/bpmnlinter)
* `CHORE`: full rewrite of internals
* `CHORE`: `utils` API change

## ...

Check `git log` for earlier history.
