const execa = require('execa');

async function testAll() {
  const result = await execa('bpmnlint', [ 'diagram.bpmn' ]);

  console.log(result);
}


testAll().catch((err) => {
  console.error(err);

  process.exit(1);
});