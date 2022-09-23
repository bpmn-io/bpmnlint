import NestedResolver from '../../../lib/resolver/nested-resolver';
import StaticResolver from '../../../lib/resolver/static-resolver';

import {
  expect
} from '../../helper';


describe.only('resolver/nested-resolver', function() {

  const resolver = new NestedResolver([
    new StaticResolver({
      'rule:plugin-a/foo': 'RULE',
      'rule:plugin-a/bar': 'RULE',
      'rule:plugin-a/baz': 'RULE',
      'config:plugin-a/all': 'CONFIG'
    }),
    new StaticResolver({
      'rule:plugin-a/bar': 'RULE',
      'rule:plugin-b/foo': 'RULE',
      'config:bar/recommended': {
        'plugin-a/baz': 'off'
      }
    })
  ]);


  describe('#resolveRule', function() {

    it('should resolve rule from plugin-a', async function() {

      // when
      const resolvedRule = await resolver.resolveRule('plugin-a', 'foo');

      // then
      expect(resolvedRule).to.eql('RULE');
    });


    it('should resolve rule from plugin-b', async function() {

      // when
      const resolvedRule = await resolver.resolveRule('plugin-b', 'foo');

      // then
      expect(resolvedRule).to.eql('RULE');
    });


    it('should throw on unresolved rule', async function() {

      let error;

      // when
      try {
        await resolver.resolveRule('plugin-a', 'non-existing-rule');
      } catch (e) {
        error = e;
      }

      // then
      expect(error).to.exist;
      expect(error.message).to.eql('unknown rule <plugin-a/non-existing-rule>');
    });

  });

});