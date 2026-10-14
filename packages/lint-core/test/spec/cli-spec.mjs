import { execa } from 'execa';

import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, stubCJS } from '../helper.mjs';

const {
  __dirname
} = stubCJS(import.meta.url);

const FIXTURE = join(__dirname, '../fixtures/foolint');

const BIN = join(FIXTURE, 'bin/foolint.js');

const PROJECT = join(FIXTURE, 'project');


describe('cli', function() {

  this.timeout(20000);

  async function run(args, cwd = PROJECT) {

    const { exitCode, stdout, stderr } = await execa(process.execPath, [ BIN, ...args ], {
      cwd,
      reject: false
    });

    return {
      code: exitCode,
      stdout: stdout.trim(),
      stderr: stderr.trim()
    };
  }


  describe('lint', function() {

    it('should pass valid', async function() {

      // when
      const { code, stdout, stderr } = await run([ 'valid.foo' ]);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.eql('');
      expect(stderr).to.eql('');
    });


    it('should report errors', async function() {

      // when
      const { code, stdout } = await run([ 'invalid.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stdout).to.contain(join(PROJECT, 'invalid.foo'));
      expect(stdout).to.match(/Invalid\s+error\s+Root is invalid\s+no-invalid/);
      expect(stdout).to.contain('✖ 1 problem (1 error, 0 warnings)');
    });


    it('should report warnings', async function() {

      // when
      const { code, stdout } = await run([ 'dubious.foo' ]);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.match(/Dubious\s+warning\s+Root is dubious\s+no-dubious/);
      expect(stdout).to.contain('✖ 1 problem (0 errors, 1 warning)');
    });


    it('should report import warnings', async function() {

      // when
      const { code, stdout } = await run([ 'import-warning.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stdout).to.match(/Warning_1\s+error\s+Import warning: unexpected attribute/);
    });


    it('should report parse errors', async function() {

      // when
      const { code, stdout } = await run([ 'broken.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stdout).to.match(/error\s+Parse error: unparsable/);
    });


    it('should lint multiple, glob', async function() {

      // when
      const { code, stdout } = await run([ '*.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stdout).to.contain(join(PROJECT, 'invalid.foo'));
      expect(stdout).to.contain(join(PROJECT, 'dubious.foo'));
      expect(stdout).not.to.contain(join(PROJECT, 'valid.foo'));
    });


    it('should ignore missing file', async function() {

      // when
      const { code, stderr } = await run([ 'missing.foo' ]);

      // then
      expect(code).to.eql(0);
      expect(stderr).to.eql('');
    });


    it('should fail on unreadable file', async function() {

      // when
      const { code, stderr } = await run([ 'ext' ]);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.contain('Error: Failed to read ext');
    });

  });


  describe('--max-warnings', function() {

    it('should fail if exceeded', async function() {

      // when
      const { code } = await run([ '--max-warnings=0', 'dubious.foo' ]);

      // then
      expect(code).to.eql(1);
    });


    it('should pass if not exceeded', async function() {

      // when
      const { code } = await run([ '--max-warnings=1', 'dubious.foo' ]);

      // then
      expect(code).to.eql(0);
    });

  });


  describe('--config', function() {

    it('should use given config', async function() {

      // when
      const { code, stdout } = await run([ '--config', 'with-extension.json', 'invalid.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stdout).to.contain('no-invalid');
    });


    it('should use <moddleExtensions>', async function() {

      // when
      const { code, stdout } = await run([ '-c', 'with-extension.json', 'dubious.foo' ]);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.match(/Root is dubious \(ext\)/);
    });


    it('should fail on missing moddle extension', async function() {

      // when
      const { code, stderr } = await run([ '-c', 'with-missing-extension.json', 'valid.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.contain('Error: Could not load moddle extension <ext> from ./does-not-exist');
      expect(stderr).to.contain('Cannot find module');
    });


    it('should fail on missing config', async function() {

      // when
      const { code, stderr } = await run([ '-c', 'missing.json', 'valid.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.eql('Error: Could not read missing.json');
    });


    it('should fail on broken config', async function() {

      // when
      const { code, stderr } = await run([ '-c', 'broken-config.json', 'valid.foo' ]);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.contain('Error: Could not parse broken-config.json');
    });

  });


  describe('product', function() {

    it('should use <.foolintrc>', async function() {

      // when
      const { code, stderr } = await run([ 'valid.foo' ], FIXTURE);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.eql(`Error: Could not locate local .foolintrc file. Create one via

  foolint --init

Learn more about configuring foolint: https://example.com/foolint#configuration`);
    });


    it('should require <fileType> file', async function() {

      // when
      const { code, stderr } = await run([]);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.eql('Error: foo file path missing');
    });


    it('should show <version>', async function() {

      // when
      const { code, stdout } = await run([ '--version' ]);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.eql('1.2.3');
    });


    it('should show <help>', async function() {

      // when
      const { code, stdout } = await run([ '--help' ]);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.eql('Usage: foolint diagram.foo');
    });

  });


  describe('--init', function() {

    let dir;

    beforeEach(function() {
      dir = mkdtempSync(join(tmpdir(), 'lint-core-cli-'));
    });

    afterEach(function() {
      rmSync(dir, { recursive: true, force: true });
    });


    it('should create <.foolintrc>', async function() {

      // when
      const { code, stdout } = await run([ '--init' ], dir);

      // then
      expect(code).to.eql(0);
      expect(stdout).to.eql('Created .foolintrc file');

      expect(JSON.parse(readFileSync(join(dir, '.foolintrc'), 'utf8'))).to.eql({
        extends: 'foolint:recommended'
      });
    });


    it('should not override', async function() {

      // given
      cpSync(join(PROJECT, '.foolintrc'), join(dir, '.foolintrc'));

      // when
      const { code, stderr } = await run([ '--init' ], dir);

      // then
      expect(code).to.eql(1);
      expect(stderr).to.eql('Not overriding existing .foolintrc');

      expect(existsSync(join(dir, '.foolintrc'))).to.be.true;
    });

  });

});
