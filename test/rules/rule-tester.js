import { expect } from '../helper';

import createRuleTester from '../../lib/rule-tester';

const ruleTester = createRuleTester({
  expectEqual: (a, b) => {
    expect(a).to.eql(b);
  }
});

export default ruleTester;