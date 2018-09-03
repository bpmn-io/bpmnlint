import { isNodeOfType } from '../../lib/utils';

import { expect } from '../helper';

describe('#utils', function() {
  const node = {
    $descriptor: { allTypes: [{ name: 'bpmn:foo' }, { name: 'bpmn:bar' }] }
  };

  it('should return true if node is of given type', function() {
    expect(isNodeOfType(node, 'foo')).to.be.true;
  });

  it('should return false if node is not of given type', function() {
    expect(isNodeOfType(node, 'baz')).to.be.false;
  });
});
