import { isNodeOfType } from '../../lib/utils';

import { expect } from '../helper';

describe('utils', function() {
  it('should return true if node is of given type', function() {
    // given
    const node = {
      $descriptor: { allTypes: [{ name: 'bpmn:foo' }, { name: 'bpmn:bar' }] }
    };

    // then
    expect(isNodeOfType(node, 'foo')).to.be.true;
  });

  it('should return false if node is not of given type', function() {
    // given
    const node = { $descriptor: { allTypes: ['bpmn:bar'] } };

    // then
    expect(isNodeOfType(node, 'foo')).to.be.false;
  });
});
