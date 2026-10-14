import { execa } from 'execa';

import path from 'path';
import { fileURLToPath } from 'node:url';

import stripIndent from 'strip-indent';

import { expect } from 'chai';

const EMPTY = '';

verify.only = verifyOnly;

const __dirname = path.dirname(fileURLToPath(import.meta.url));


describe('cli', function() {

  before(function() {

    this.timeout(30000);

    return exec('install-local', [], path.join(__dirname, 'cli'));
  });


  describe('should execute', function() {

    verify({
      cmd: [ 'dmnlint', 'diagram.dmn' ],
      expect: {
        code: 0,
        stderr: EMPTY,
        stdout: EMPTY
      }
    });


    verify({
      cmd: [ 'dmnlint', 'diagram-invalid.dmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

          ${diagramPath('diagram-invalid.dmn')}
            Decision_1g4u6yn  error  Element is missing label/name  label-required

          ✖ 1 problem (1 error, 0 warnings)
        `
      }
    });


    verify({
      cmd: [ 'dmnlint', 'diagram-broken.dmn' ],
      expect: {
        code: 1,
        stdout: `

          ${diagramPath('diagram-broken.dmn')}
              error  Parse error: failed to parse document as <dmn:Definitions>

          ✖ 1 problem (1 error, 0 warnings)
        `
      }
    });


    verify({
      cmd: [ 'dmnlint', '--version' ],
      expect: {
        code: 0,
        stderr: EMPTY,
        stdout: /^\d+\.\d+\.\d+/
      }
    });


    verify({
      cmd: [ 'dmnlint', 'diagram*.dmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: /(?=[\s\S]*diagram-invalid\.dmn\n.*label-required)(?=[\s\S]*diagram-broken\.dmn\n.*Parse error)/
      }
    });


    verify({
      cmd: [ 'dmnlint', '-c', 'warn.json', 'diagram-invalid.dmn' ],
      expect: {
        code: 0,
        stderr: EMPTY,
        stdout: /Decision_1g4u6yn\s+warning\s+Element is missing label\/name\s+label-required[\s\S]*✖ 1 problem \(0 errors, 1 warning\)/
      }
    });


    verify({
      cmd: [ 'dmnlint', '--max-warnings=0', '-c', 'warn.json', 'diagram-invalid.dmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: /✖ 1 problem \(0 errors, 1 warning\)/
      }
    });


    verify({
      cmd: [ 'dmnlint', '-c', 'non-existing.json', 'diagram.dmn' ],
      expect: {
        code: 1,
        stderr: /^Error: Could not read non-existing\.json/,
        stdout: EMPTY
      }
    });


    verify({
      cmd: [ 'dmnlint', 'diagram.dmn' ],
      cwd: __dirname + '/cli/empty',
      expect: {
        code: 1,
        stderr: /^Error: Could not locate local \.dmnlintrc file/,
        stdout: EMPTY
      }
    });

  });


  describe('should resolve plug-ins from working directory', function() {

    before(function() {

      this.timeout(30000);

      return exec('install-local', [], __dirname + '/cli/child');
    });


    verify({
      cmd: [ 'dmnlint', 'diagram.dmn' ],
      cwd: __dirname + '/cli/child'
    });

  });


  describe('should handle namespaced packages', function() {

    before(function() {

      this.timeout(30000);

      return exec('install-local', [], __dirname + '/cli/ns');
    });


    describe('providing rules', function() {

      verify({
        cmd: [ 'dmnlint', '-c', 'uses-rules.json', 'diagram.dmn' ],
        cwd: __dirname + '/cli/ns',
      });


      verify({
        cmd: [ 'dmnlint', '-c', 'uses-rules.json', 'diagram-invalid.dmn' ],
        cwd: __dirname + '/cli/ns',
        expect: {
          code: 1,
          stderr: EMPTY,
          stdout: `

            ${diagramPath('ns/diagram-invalid.dmn')}
              Decision_1g4u6yn  error  Element has non-sense label <xxx>  test2/no-label-xxx
              Decision_1g4u6yn  error  Element has non-sense label <xxx>  @ns/test/no-label-xxx

            ✖ 2 problems (2 errors, 0 warnings)
          `
        }
      });

    });


    describe('providing configuration', function() {

      verify({
        cmd: [ 'dmnlint', '-c', 'extends.json', 'diagram.dmn' ],
        cwd: __dirname + '/cli/ns',
      });


      verify({
        cmd: [ 'dmnlint', '-c', 'extends.json', 'diagram-invalid.dmn' ],
        cwd: __dirname + '/cli/ns',
        expect: {
          code: 1,
          stderr: EMPTY,
          stdout: `

            ${diagramPath('ns/diagram-invalid.dmn')}
              Decision_1g4u6yn  error  Element has non-sense label <xxx>  @ns/test/no-label-xxx
              Decision_1g4u6yn  error  Element has non-sense label <xxx>  test2/no-label-xxx

            ✖ 2 problems (2 errors, 0 warnings)
          `
        }
      });

    });
  });

});


// helper /////////////////////////////

function exec(prog, args, cwd, options = {}) {

  return execa(prog, args, {
    cwd,
    ...options
  });
}

function verify(options) {

  const {
    cmd,
    cwd,
    expect: _expect,
    only
  } = options;

  const expected = _expect || { code: 0 };

  (only ? it.only : it)(cmd.join(' ') + (cwd ? ` (cwd: ${cwd})` : ''), async function() {

    this.timeout(3000);

    // when
    const {
      stdout
    } = await exec('npm', [ 'test', '--', ...cmd ], __dirname + '/cli', {
      env: {
        dmnlint_TEST_CWD: cwd || ''
      }
    });

    // then
    if ('stderr' in expected) {
      expectOutput(parseOutput(stdout, '---- STDERR'), expected.stderr);
    }

    if ('stdout' in expected) {
      expectOutput(parseOutput(stdout, '---- STDOUT'), expected.stdout);
    }


    const code = expected.code || 0;

    expect(
      parseInt(
        parseOutput(stdout, '---- CODE'), 10
      )
    ).to.eql(code);
  });

}

function verifyOnly(options) {
  return verify({
    only: true,
    ...options
  });
}

function diagramPath(diagramName) {
  return path.resolve(`${__dirname}/cli/${diagramName}`);
}

function parseOutput(output, separator) {

  const regexp = new RegExp(separator + '\n');

  return trimRight(output.split(regexp)[1]);
}

function expectOutput(actual, expected) {

  let matcher;

  if (expected instanceof RegExp) {
    matcher = 'match';
  } else {
    expected = trimRight(
      stripIndent(expected)
    );

    matcher = 'eql';
  }

  expect(actual).to[matcher](expected);
}

function trimRight(output) {
  return output
    .split(/\n/)
    .map(s => s.replace(/\s+$/, EMPTY))
    .join('\n');
}