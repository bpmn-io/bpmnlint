import path from 'node:path';
import fs from 'node:fs';

import { execa } from 'execa';

import { expect } from 'chai';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


describe('compile', function() {

  before(function() {

    this.timeout(100000);

    return exec('install-local', [], __dirname + '/compilation');
  });


  test();

});


function test(options = { it: it }) {

  options.it('should compile configuration', async function() {

    this.timeout(100000);

    // when
    const {
      exitCode
    } = await exec('npm', [ 'run', 'compile' ], path.join(__dirname, 'compilation'), {
      stdio: 'inherit'
    });

    // then
    expect(exitCode).to.eql(0);

    const actualFile = path.join(__dirname, 'compilation', 'test', 'bpmnlintrc.actual.js');
    const expectedFile = path.join(__dirname, 'compilation', 'test', 'bpmnlintrc.expected.js');

    const root = path.posix.normalize(
      process.cwd().split(path.sep).join(path.posix.sep)
    );

    if (process.env.UPDATE_FIXTURES) {
      fs.writeFileSync(expectedFile, read(actualFile).split(root).join('$ROOT'), 'utf8');
    }

    const actualContents = read(actualFile).split(root).join('$ROOT');

    // and
    expect(
      actualContents,
      `${ actualFile } and ${ expectedFile } equal`
    ).to.eql(
      read(expectedFile)
    );

    expect(actualContents).to.match(
      /import rule_[0-9]+ from 'bpmnlint-plugin-test\/rules\/no-label-foo'/
    );

    expect(actualContents).to.match(
      /import rule_[0-9]+ from 'bpmnlint-plugin-exported\/src\/bar'/
    );

    expect(actualContents).to.match(
      /import rule_[0-9]+ from 'bpmnlint-plugin-exported\/rules\/baz'/
    );

    expect(actualContents).to.match(
      /import rule_[0-9]+ from 'bpmnlint-plugin-exported\/src\/foo'/
    );

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