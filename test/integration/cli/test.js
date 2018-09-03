const execa = require('execa');

async function testAll() {
  await execa('bpmnlint', [ 'diagram.bpmn' ]);
}


testAll().catch((err) => {
  console.error(err);

  process.exit(1);
});