import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

import { expect, stubCJS } from '../helper.mjs';

const {
  __dirname,
  require
} = stubCJS(import.meta.url);

const root = join(__dirname, '../..');

const pkg = require('../../package.json');


describe('pack', function() {

  let files;

  before(function() {

    this.timeout(60000);

    const [ { files: packed } ] = JSON.parse(execFileSync('npm', [ 'pack', '--dry-run', '--json' ], {
      cwd: root,
      encoding: 'utf8',
      shell: process.platform === 'win32'
    }));

    files = packed.map(file => file.path);
  });


  it('should ship exported modules', function() {

    // when
    const missing = Object.values(pkg.exports).flatMap(value => {
      return value === null ? [] : (typeof value === 'string' ? [ value ] : Object.values(value));
    }).filter(target => !target.includes('*')).map(target => target.replace(/^\.\//, '')).filter(target => {
      return !files.includes(target);
    });

    // then
    expect(missing).to.eql([]);
  });


  it('should ship rules and configs', function() {

    expect(files).to.include('rules/label-required.js');
    expect(files).to.include('rules/helper.js');
    expect(files).to.include('config/recommended.js');
  });


  it('should ship executable', function() {

    expect(files).to.include('bin/bpmnlint.js');
  });


  it('should NOT ship tests', function() {

    expect(files.filter(file => file.startsWith('test/'))).to.eql([]);
  });


  it('should declare existing dependencies', function() {

    expect(pkg.dependencies).to.have.property('@bpmn-io/lint-core');
    expect(pkg.dependencies).to.have.property('bpmnlint-utils');
    expect(existsSync(join(root, '..', 'lint-core', 'package.json'))).to.be.true;
  });

});
