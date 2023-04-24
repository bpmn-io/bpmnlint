import path from 'path';
import fs from 'fs';

import execa from 'execa';

import { expect } from 'chai';


describe('bundling', function() {

  before(function() {

    this.timeout(30000);

    return exec('install-local', [], __dirname + '/bundling');
  });


  test('rollup');

  test('webpack');

});


function test(bundler, options = { it: it }) {

  it(`should bundle with ${bundler}`, async function() {

    // when
    const {
      exitCode
    } = await exec('npm', [ 'run', `bundle:${bundler}` ], path.join(__dirname, 'bundling'));

    // then
    expect(exitCode).to.eql(0);

    const actualFile = path.join(__dirname, `bundling/dist/app.${bundler}.js`);
    const expectedFile = path.join(__dirname, `bundling/test/app.${bundler}.expected.js`);

    if (process.env.UPDATE_FIXTURES) {
      fs.writeFileSync(expectedFile, read(actualFile), 'utf8');
    }

    // and
    expect(
      read(actualFile), `${ actualFile } and ${ expectedFile } equal`
    ).to.eql(
      read(expectedFile)
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