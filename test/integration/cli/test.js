const execa = require('execa');

async function testAll() {

  await execa('bpmnlint', [ 'diagram.bpmn' ]);

  await execa('bpmnlint', [ '-c', 'extends-builtin.json', 'diagram.bpmn' ]);

  await execa('bpmnlint', [ '-c', 'extends-external.json', 'diagram.bpmn' ]);

}


testAll().catch((err) => {
  console.error(err);

  process.exit(1);
});