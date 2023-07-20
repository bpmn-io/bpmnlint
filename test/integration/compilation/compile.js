const fs = require('fs');

const compileConfig = require('bpmnlint/lib/support/compile-config');

const config = {
  extends: [
    'plugin:test/recommended',
    'plugin:exported/recommended'
  ]
};

compileConfig(config).then(code => fs.writeFileSync('test/bpmnlintrc.actual.js', code)).catch(err => {
  console.error(err);

  process.exit(1);
});