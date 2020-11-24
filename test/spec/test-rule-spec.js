import testRule from '../../lib/test-rule';

import { expect, createRule, readModdle } from '../helper';

import { is } from 'bpmnlint-utils';


describe('test-rule', function() {

  let moddleRoot;

  beforeEach(async function() {
    const result = await readModdle(__dirname + '/diagram.bpmn');

    moddleRoot = result.root;
  });

  it('should return reported messages', () => {

    // given
    const expectedMessages = [
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions detected'
      }
    ];
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeRuleWithReports)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });


  it('should empty messages', () => {

    // given
    const expectedMessages = [];

    // when
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeRuleWithoutReports)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });

});

function fakeRuleWithReports() {
  function check(node, reporter) {
    if (is(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions detected');
    }
  }

  return { check };
}

function fakeRuleWithoutReports() {
  return { check: () => {} };
}
