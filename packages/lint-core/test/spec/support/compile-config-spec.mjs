import { createCompileConfig } from '../../../lib/support/compile-config.js';

import { createLinter } from '../../../lib/linter.js';

import { createNodeResolver } from '../../../lib/resolver/node-resolver.js';

import { expect } from '../../helper.mjs';


describe('support/compile-config', function() {

  const product = { name: 'foolint' };

  const Linter = createLinter(product);

  const NodeResolver = createNodeResolver(product, {
    requireLocal: function() {
      return () => ({ check() {} });
    }
  });

  const compileConfig = createCompileConfig({ Linter, NodeResolver });


  it('should import rules from product package', async function() {

    // when
    const code = await compileConfig({
      rules: {
        'a': 'error',
        'b': 'off',
        'foolint/c': 'warn'
      }
    });

    // then
    expect(code).to.contain('import rule_0 from \'foolint/rules/a\'');
    expect(code).to.contain('cache[\'foolint/a\'] = rule_0');

    expect(code).to.contain('import rule_2 from \'foolint/rules/c\'');
    expect(code).to.contain('cache[\'foolint/c\'] = rule_2');

    expect(code).not.to.contain('foolint/rules/b');

    expect(code).to.contain('"b": 0');
  });


  it('should import rules from plugin', async function() {

    // given
    const resolver = new NodeResolver({
      require: Object.assign(
        function(path) {

          if (path === './package.json') {
            return { name: 'foolint-plugin-local' };
          }

          throw new Error('not found: ' + path);
        },
        { resolve() {} }
      )
    });

    // when
    const code = await compileConfig({
      rules: {
        'bar/d': 'error'
      }
    }, resolver);

    // then
    expect(code).to.contain('import rule_0 from \'foolint-plugin-bar/rules/d\'');
    expect(code).to.contain('cache[\'foolint-plugin-bar/d\'] = rule_0');
  });

});
