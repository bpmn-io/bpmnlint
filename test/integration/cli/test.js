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

const options = process.env.BPMNLINT_TEST_CWD ? { cwd: process.env.BPMNLINT_TEST_CWD } : {};

execa(bin, args, options).then(
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