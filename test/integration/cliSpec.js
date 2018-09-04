import execa from 'execa';


describe('cli', function() {

  before(async function() {

    this.timeout(30000);

    await execa('install-local', [ '../../..', '../bpmnlint-plugin-test' ], { cwd: __dirname + '/cli' });

  });


  it('should execute bpmnlint', async function() {

    await execa('npm', [ 'test' ], { cwd: __dirname + '/cli' });

  });

});