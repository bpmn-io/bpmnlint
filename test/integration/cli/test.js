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

execa(bin, args).then(
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