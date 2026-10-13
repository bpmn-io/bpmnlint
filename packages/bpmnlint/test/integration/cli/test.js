const execa = require('execa');

/**
 * Execute bpmnlint as provided via arguments.
 *
 * Report { stdout, stderr, code } via output
 * for further processing.
 */


const [
  bin,
  ...args
] = process.argv.slice(2);

const cwd = process.env.BPMNLINT_TEST_CWD || process.cwd();

console.log('---- CMD');
console.log('%s %s (cwd: %s)', bin, args.join(' '), cwd);
console.log('---- CMD');

execa(bin, args, {
  cwd
}).then(
  function(result) {
    return result;
  },
  function(err) {
    return err;
  }
).then(function(result) {
  const {
    stdout,
    stderr,
    exitCode
  } = result;

  console.log('---- STDOUT');

  if (stdout) {
    console.log(stdout);
  }

  console.log('---- STDOUT');
  console.log('---- STDERR');

  if (stderr) {
    console.log(stderr);
  }

  console.log('---- STDERR');
  console.log('---- CODE');

  console.log(exitCode);

  console.log('---- CODE');
  console.log('---- END');
});