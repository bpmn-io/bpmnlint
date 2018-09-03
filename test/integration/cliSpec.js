import execa from 'execa';


describe('bpmnlint', function() {

  before(async function() {

    this.timeout(30000);

    await execa('npm', [ 'install' ], { cwd: __dirname + '/cli' });

  });


  it('should execute cli', async function() {

    await execa('npm', [ 'test' ], { cwd: __dirname + '/cli' });

  });

});