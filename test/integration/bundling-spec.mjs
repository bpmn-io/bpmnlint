import path from 'node:path';
import fs from 'node:fs';
import vm from 'node:vm';

import { execa } from 'execa';

import { expect } from 'chai';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


describe('bundling', function() {

  before(function() {

    this.timeout(100000);

    return exec('install-local', [], __dirname + '/bundling');
  });


  test('rollup');

  test('webpack');

});


function test(bundler, options = { it: it }) {

  options.it(`should bundle with ${bundler}`, async function() {

    this.timeout(100000);

    // when
    const {
      exitCode
    } = await exec('npm', [ 'run', `bundle:${bundler}` ], path.join(__dirname, 'bundling'));

    // then
    expect(exitCode).to.eql(0);

    const actualFile = path.join(__dirname, `bundling/dist/app.${bundler}.js`);
    const actualContents = read(actualFile);

    let bundle;

    vm.runInNewContext(actualContents, {
      console: {
        log: value => bundle = value
      }
    });

    expect(JSON.parse(JSON.stringify(bundle.config.rules))).to.eql({
      'label-required': 1,
      'start-event-required': 'info',
      'end-event-required': 2,
      'exported/foo': 'error',
      'exported/foo-absolute': 'error'
    });

    expect(JSON.parse(JSON.stringify(bundle.moddleExtensions.spell))).to.eql(
      JSON.parse(read(path.join(__dirname, 'bundling/src/spell.json')))
    );

    const cases = [
      [ 'label-required', 'bpmn:FlowNode', 'Element is missing label/name' ],
      [ 'start-event-required', 'bpmn:Process', 'Process is missing start event' ],
      [ 'end-event-required', 'bpmn:Process', 'Process is missing end event' ]
    ];

    for (const [ ruleName, type, message ] of cases) {
      const rule = bundle.resolver.resolveRule('bpmnlint', ruleName);
      const reports = [];

      rule().check({
        id: 'element',
        $instanceOf: expected => expected === type
      }, {
        report: (id, message) => reports.push([ id, message ])
      });

      expect(reports).to.eql([ [ 'element', message ] ]);
    }

    const foo = bundle.resolver.resolveRule('bpmnlint-plugin-exported', 'foo');
    const fooAbsolute = bundle.resolver.resolveRule('bpmnlint-plugin-exported', 'foo-absolute');

    expect(foo().check).to.be.a('function');
    expect(fooAbsolute).to.equal(foo);
    expect(() => bundle.resolver.resolveRule('bpmnlint-plugin-exported', 'bar')).to.throw('not bundled');
    expect(() => bundle.resolver.resolveConfig('bpmnlint', 'recommended')).to.throw('not bundled');

    expect(actualContents).not.to.include('function bar()');
    expect(actualContents).to.include('function foo()');
  });

}

function exec(prog, args, cwd, options = {}) {

  return execa(prog, args, {
    cwd,
    ...options
  });
}

function read(fileName) {
  expect(fs.existsSync(fileName), `${fileName} exists`).to.be.true;

  return fs.readFileSync(fileName, 'utf8').replace(/\r\n/g, '\n').replace(/\t/g, '  ');
}