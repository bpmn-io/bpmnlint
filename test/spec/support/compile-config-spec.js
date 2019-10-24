const { expect } = require('chai');

import compileConfig from '../../../lib/support/compile-config';


describe('support/compile-config', function() {

  it('should import rules', async function() {

    // when
    const code = await compileConfig({
      rules: {
        'conditional-flows': 'error',
        'single-blank-start-event': 'off'
      }
    });

    // then
    // imports enabled rule
    expect(code).to.contain('import rule_0 from \'bpmnlint/rules/conditional-flows\'');
    expect(code).to.contain('cache[\'bpmnlint/conditional-flows\'] = rule_0');

    // does not contain disabled rule
    expect(code).not.to.contain('bpmnlint/rules/single-blank-start-event');

    // exports config and resolver
    expect(code).to.contain('export { resolver, config };');

    expect(code).to.contain('export default bundle;');
  });


  it('should import namespaced', async function() {

    // when
    const code = await compileConfig({
      rules: {
        '@foo/bar/rule': 'warn'
      }
    });

    // then
    expect(code).to.contain('import rule_0 from \'@foo/bpmnlint-plugin-bar/rules/rule\'');
    expect(code).to.contain('cache[\'@foo/bpmnlint-plugin-bar/rule\'] = rule_0');
  });


  it('should resolve extends', async function() {

    // when
    const code = await compileConfig({
      extends: 'bpmnlint:recommended'
    });

    // then
    // bundles enabled rules
    expect(code).to.contain('conditional-flows');
    expect(code).to.contain('single-blank-start-event');
  });

});