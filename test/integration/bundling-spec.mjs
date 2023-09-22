import path from 'node:path';
import fs from 'node:fs';

import { execa } from 'execa';

import { expect } from 'chai';

import { stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);


(/^v1[24]/.test(process.version) ? describe.skip : describe)('bundling', function() {

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
    const expectedFile = path.join(__dirname, `bundling/test/app.${bundler}.expected.js`);

    const root = process.cwd().replace(/[/\\. -]+/g, '_');

    if (process.env.UPDATE_FIXTURES) {
      fs.writeFileSync(expectedFile, read(actualFile).split(root).join(''), 'utf8');
    }

    const actualContents = read(actualFile);

    // and
    expect(
      actualContents.split(root).join(''),
      `${ actualFile } and ${ expectedFile } equal`
    ).to.eql(
      read(expectedFile).split(root).join('')
    );

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