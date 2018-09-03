import nodeResolver from '../../../lib/rule-resolver/nodeResolver';

import {
  expect
} from '../../helper';


describe('nodeResolver', function() {

  it('should resolve built in rule', function() {

    // when
    const path = nodeResolver.getRulePath('label-required');

    // then
    expect(path).to.eql('../../rules/label-required');
  });


  it('should resolve external rule', function() {

    // when
    const path = nodeResolver.getRulePath('foo/label-required');

    // then
    expect(path).to.eql('foo/rules/label-required');
  });

})