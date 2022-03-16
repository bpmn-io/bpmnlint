import execa from 'execa';

import path from 'path';

import stripIndent from 'strip-indent';

import { expect } from 'chai';

const EMPTY = '';


describe('cli', function() {

  before(function() {

    this.timeout(30000);

    return exec('install-local', [], __dirname + '/cli');
  });


  describe('should execute', function() {

    test({
      cmd: [ 'bpmnlint', 'diagram.bpmn' ],
      expect: {
        code: 0,
        stderr: EMPTY,
        stdout: EMPTY
      }
    });


    test({
      cmd: [ 'bpmnlint', 'diagram-invalid.bpmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

          ${diagramPath('diagram-invalid.bpmn')}
            Process_08k516a  error  Process is missing start event  start-event-required
            Process_08k516a  error  Process is missing end event    end-event-required

          ✖ 2 problems (2 errors, 0 warnings)
        `
      }
    });


    test({
      cmd: [ 'bpmnlint', 'diagram-broken.bpmn' ],
      expect: {
        code: 1,
        stdout: `

          ${diagramPath('diagram-broken.bpmn')}
              error  Parse error: failed to parse document as <bpmn:Definitions>

          ✖ 1 problem (1 error, 0 warnings)
        `
      }
    });


    test({
      cmd: [ 'bpmnlint', 'diagram-import-warnings.bpmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

          ${diagramPath('diagram-import-warnings.bpmn')}
            MessageFlow_1ofxm38     error  Import warning: unresolved reference <Participant_1w6hx42>
            Participant_1sh3ce3_di  error  Import warning: unresolved reference <Participant_1w6hx42>
            Process_1               error  Process is missing start event                              start-event-required
            Process_1               error  Process is missing end event                                end-event-required

          ✖ 4 problems (4 errors, 0 warnings)
        `
      }
    });


    test({
      cmd: [ 'bpmnlint', '-c', 'extends-builtin.json', 'diagram.bpmn' ]
    });


    test({
      cmd: [ 'bpmnlint', '-c', 'extends-external.json', 'diagram.bpmn' ]
    });


    test({
      cmd: [ 'bpmnlint', 'complex.bpmn' ],
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

          ${diagramPath('complex.bpmn')}
            sid-8D8BD39F-1B08-433F-8F93-A1FF7520BA8B  error    Import warning: unknown attribute <isCollection>
            sid-E391B624-F6E8-428B-9C3E-7026F85C4F24  warning  Element is missing label/name                     label-required
            sid-3E1FA189-AC8C-4CF1-9057-3D2EF8C6D3AF  warning  Element is missing label/name                     label-required
            sid-DD0BC4E1-4AA3-4835-A477-373EA263A593  warning  Element is missing label/name                     label-required
            sid-B8B18E3A-EF8D-4D19-B5CD-C666D39E2E0D  warning  Element is missing label/name                     label-required
            sid-994BB7B0-64D8-4DC4-B549-0758628F5A16  warning  Element is missing label/name                     label-required
            sid-0F208AE2-EC60-4823-9B6A-D062A91587F2  warning  Element is missing label/name                     label-required
            sid-B22F345F-EAB4-4D92-A810-C4B9AFCC4A6F  warning  Element is missing label/name                     label-required
            sid-4E447BCA-4A6B-4944-8A1C-1A184D6A95FD  warning  Element is missing label/name                     label-required
            sid-4A0FB2B3-2D67-46F7-ACB3-260FC62E3B5A  warning  Element is missing label/name                     label-required
            sid-13E4B11F-E8D5-434E-9AE3-A42ED2084731  warning  Element is missing label/name                     label-required

          ✖ 11 problems (1 error, 10 warnings)
        `
      }
    });


    test({
      cmd: [ 'bpmnlint', '-c', 'non-existing.json', 'diagram.bpmn' ],
      expect: {
        code: 1,
        stderr: /^Error: Could not read non-existing\.json/,
        stdout: EMPTY
      }
    });


    test({
      cmd: [ 'bpmnlint', 'diagram.bpmn' ],
      cwd: __dirname + '/cli/empty',
      expect: {
        code: 1,
        stderr: /^Error: Could not locate local \.bpmnlintrc file/,
        stdout: EMPTY
      }
    });


    test({
      cmd: [ 'bpmnlint', '--version' ],
      expct: {
        code: 0,
        stderr: EMPTY,
        stdout: require('../../package.json').version
      }
    });

  });


  describe('should resolve plug-ins from working directory', function() {

    before(function() {

      this.timeout(30000);

      return exec('install-local', [], __dirname + '/cli/child');
    });


    test({
      cmd: [ 'bpmnlint', 'diagram.bpmn' ],
      cwd: __dirname + '/cli/child'
    });

  });


  describe('should handle namespaced packages', function() {

    before(function() {

      this.timeout(30000);

      return exec('install-local', [], __dirname + '/cli/ns');
    });


    describe('providing rules', function() {

      test({
        cmd: [ 'bpmnlint', '-c', 'uses-rules.json', 'diagram.bpmn' ],
        cwd: __dirname + '/cli/ns',
      });


      test({
        cmd: [ 'bpmnlint', '-c', 'uses-rules.json', 'diagram-invalid.bpmn' ],
        cwd: __dirname + '/cli/ns',
        expect: {
          code: 1,
          stderr: EMPTY,
          stdout: `

            ${diagramPath('ns/diagram-invalid.bpmn')}
              StartEvent  error  Element has non-sense label <xxx>  test2/no-label-xxx
              StartEvent  error  Element has non-sense label <xxx>  @ns/test/no-label-xxx

            ✖ 2 problems (2 errors, 0 warnings)
          `
        }
      });

    });


    describe('providing configuration', function() {

      test({
        cmd: [ 'bpmnlint', '-c', 'extends.json', 'diagram.bpmn' ],
        cwd: __dirname + '/cli/ns',
      });


      test({
        cmd: [ 'bpmnlint', '-c', 'extends.json', 'diagram-invalid.bpmn' ],
        cwd: __dirname + '/cli/ns',
        expect: {
          code: 1,
          stderr: EMPTY,
          stdout: `

            ${diagramPath('ns/diagram-invalid.bpmn')}
              StartEvent  error  Element has non-sense label <xxx>  @ns/test/no-label-xxx
              StartEvent  error  Element has non-sense label <xxx>  test2/no-label-xxx

            ✖ 2 problems (2 errors, 0 warnings)
          `
        }
      });

    });
  });


  describe('should handle glob star patterns', function() {
    test({
      cmd: [ 'bpmnlint', '*.bpmn'],
      cwd: __dirname + '/cli',
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

          ${diagramPath('complex.bpmn')}
            sid-8D8BD39F-1B08-433F-8F93-A1FF7520BA8B  error    Import warning: unknown attribute <isCollection>
            sid-E391B624-F6E8-428B-9C3E-7026F85C4F24  warning  Element is missing label/name                     label-required
            sid-3E1FA189-AC8C-4CF1-9057-3D2EF8C6D3AF  warning  Element is missing label/name                     label-required
            sid-DD0BC4E1-4AA3-4835-A477-373EA263A593  warning  Element is missing label/name                     label-required
            sid-B8B18E3A-EF8D-4D19-B5CD-C666D39E2E0D  warning  Element is missing label/name                     label-required
            sid-994BB7B0-64D8-4DC4-B549-0758628F5A16  warning  Element is missing label/name                     label-required
            sid-0F208AE2-EC60-4823-9B6A-D062A91587F2  warning  Element is missing label/name                     label-required
            sid-B22F345F-EAB4-4D92-A810-C4B9AFCC4A6F  warning  Element is missing label/name                     label-required
            sid-4E447BCA-4A6B-4944-8A1C-1A184D6A95FD  warning  Element is missing label/name                     label-required
            sid-4A0FB2B3-2D67-46F7-ACB3-260FC62E3B5A  warning  Element is missing label/name                     label-required
            sid-13E4B11F-E8D5-434E-9AE3-A42ED2084731  warning  Element is missing label/name                     label-required

          ${diagramPath('diagram-broken.bpmn')}
              error  Parse error: failed to parse document as <bpmn:Definitions>

          ${diagramPath('diagram-import-warnings.bpmn')}
            MessageFlow_1ofxm38     error  Import warning: unresolved reference <Participant_1w6hx42>
            Participant_1sh3ce3_di  error  Import warning: unresolved reference <Participant_1w6hx42>
            Process_1               error  Process is missing start event                              start-event-required
            Process_1               error  Process is missing end event                                end-event-required

          ${diagramPath('diagram-invalid.bpmn')}
            Process_08k516a  error  Process is missing start event  start-event-required
            Process_08k516a  error  Process is missing end event    end-event-required

          ✖ 18 problems (8 errors, 10 warnings)
        `
      }
    });

    test({
      cmd: [ 'bpmnlint', 'glob/**/*.bpmn'],
      cwd: __dirname + '/cli',
      expect: {
        code: 1,
        stderr: EMPTY,
        stdout: `

        ${diagramPath('glob/diagram-invalid.bpmn')}
          Process_08k516a  error  Process is missing start event  start-event-required
          Process_08k516a  error  Process is missing end event    end-event-required

        ${diagramPath('glob/subfolder/diagram-import-warnings.bpmn')}
          MessageFlow_1ofxm38     error  Import warning: unresolved reference <Participant_1w6hx42>
          Participant_1sh3ce3_di  error  Import warning: unresolved reference <Participant_1w6hx42>
          Process_1               error  Process is missing start event                              start-event-required
          Process_1               error  Process is missing end event                                end-event-required

        ✖ 6 problems (6 errors, 0 warnings)
        `
      }
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

function test(options) {

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
        BPMNLINT_TEST_CWD: cwd || ''
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

// eslint-disable-next-line no-unused-vars
function testOnly(options) {
  test({
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
