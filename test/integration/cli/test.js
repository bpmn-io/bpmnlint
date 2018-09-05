const execa = require('execa');

const assert = require('assert');

async function exec(...args) {

  try {
    return await execa(...args);
  } catch (err) {
    return err;
  }
}

function verifyResult({ code, stdout }) {

  return (result) => {

    if (typeof code !== 'undefined') {
      assert.equal(result.code, code);
    }

    if (typeof stdout !== 'undefined') {
      assert.equal(result.stdout, stdout);
    }
  };
}

async function testAll() {

  await exec('bpmnlint', [ 'diagram.bpmn' ]).then(verifyResult({
    code: 0,
    stdout: `
found 0 errors and 0 warnings`
  }));

  await exec('bpmnlint', [ 'diagram-invalid.bpmn' ]).then(verifyResult({
    code: 1,
    stdout: `
rule: start-event-required
error: Process_08k516a is missing a Start Event

rule: end-event-required
error: Process_08k516a is missing an End Event

found 2 errors and 0 warnings
`
  }));

  await exec('bpmnlint', [ '-c', 'extends-builtin.json', 'diagram.bpmn' ]).then(verifyResult({ code: 0 }));

  await exec('bpmnlint', [ '-c', 'extends-external.json', 'diagram.bpmn' ]).then(verifyResult({ code: 0 }));
}


testAll().catch((err) => {
  console.error(err);

  process.exit(1);
});