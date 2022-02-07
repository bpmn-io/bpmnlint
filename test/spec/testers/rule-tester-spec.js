import { getTitle } from '../../../lib/testers/rule-tester';

import { expect } from '../../helper';


describe('rule-tester', function() {

  describe('#getTitle', function() {

    it('it should get name (index)', function() {

      // when
      const title = getTitle(1);

      // then
      expect(title).to.equal('test case #2');
    });


    it('it should get name (index and name)', function() {

      // when
      const title = getTitle(1, 'foo');

      // then
      expect(title).to.equal('test case #2 foo');
    });

  });

});