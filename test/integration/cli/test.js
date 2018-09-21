const execa = require('execa');

const assert = require('assert');

const path = require('path');


async function exec(...args) {

  let result;

  try {
    result = await execa(...args);
  } catch (err) {
    result = err;
  }

  console.log(`
${result.cmd}
${result.stdout}
  `);

  return result;
}

function verifyResult({ code, stdout }) {

  return (result) => {

    if (typeof code !== 'undefined') {
      assert.equal(result.code, code);
    }

    if (typeof stdout !== 'undefined') {
      assert.equal(result.stdout.replace(/( )+\n/g, '\n'), stdout);
    }
  };
}

async function testAll() {

  await exec('bpmnlint', [ 'diagram.bpmn' ]).then(verifyResult({
    code: 0,
    stdout: ''
  }));

  await exec('bpmnlint', [ 'diagram-invalid.bpmn' ]).then(verifyResult({
    code: 1,
    stdout: `

${path.resolve(__dirname + '/diagram-invalid.bpmn')}
  Process_08k516a  error  is missing a start event  start-event-required
  Process_08k516a  error  is missing an end event   end-event-required

✖ 2 problems (2 errors, 0 warnings)
`
  }));

  await exec('bpmnlint', [ '-c', 'extends-builtin.json', 'diagram.bpmn' ]).then(verifyResult({ code: 0 }));

  await exec('bpmnlint', [ '-c', 'extends-external.json', 'diagram.bpmn' ]).then(verifyResult({ code: 0 }));

  await exec('bpmnlint', [ 'complex.bpmn' ]).then(verifyResult({ code: 0 }));
}


testAll().catch((err) => {
  console.error(err);

  process.exit(1);
});