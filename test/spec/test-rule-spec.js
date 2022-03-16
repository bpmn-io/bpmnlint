import testRule from '../../lib/test-rule';

import { expect, createRule, readModdle } from '../helper';

import { is } from 'bpmnlint-utils';


describe('test-rule', function() {

  let moddleRoot;

  beforeEach(async function() {
    const result = await readModdle(__dirname + '/diagram.bpmn');

    moddleRoot = result.root;
  });


  it('should return check function reported messages (id, message)', () => {

    // given
    const expectedMessages = [
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions detected'
      }
    ];
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeCheckRuleWithReports)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });


  it('should return check function reported messages (id, message, path)', () => {

    // given
    const expectedMessages = [
      {
        id: 'Collaboration_0wzd2dx',
        message: 'Collaboration detected',
        path: [ 'rootElements', 0 ]
      }
    ];
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeCheckRuleWithPath)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });


  it('should return check function reported messages (id, message, { path })', () => {

    // given
    const expectedMessages = [
      {
        id: 'Collaboration_0wzd2dx',
        message: 'Collaboration detected',
        path: [ 'rootElements', 0 ],
        foo: 'foo'
      }
    ];
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeCheckRuleWithObject)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });


  it('should return { enter, leave } hook reported messages', () => {

    // given
    const expectedMessages = [
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions enter'
      },
      {
        id: 'sid-38422fae-e03e-43a3-bef4-bd33b32041b2',
        message: 'Definitions leave'
      }
    ];
    const messages = testRule({
      moddleRoot,
      rule: createRule(fakeEnterLeaveRuleWithReports)
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
      rule: createRule(fakeCheckRuleWithoutReports)
    });

    // then
    expect(messages).to.eql(expectedMessages);
  });

});

function fakeCheckRuleWithReports() {
  function check(node, reporter) {
    if (is(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions detected');
    }
  }

  return { check };
}

function fakeCheckRuleWithPath() {
  function check(node, reporter) {
    if (is(node, 'Collaboration')) {
      reporter.report(node.id, 'Collaboration detected', [ 'rootElements', 0 ]);
    }
  }

  return { check };
}

function fakeCheckRuleWithObject() {
  function check(node, reporter) {
    if (is(node, 'Collaboration')) {
      reporter.report(node.id, 'Collaboration detected', {
        path: [ 'rootElements', 0 ],
        foo: 'foo'
      });
    }
  }

  return { check };
}

function fakeEnterLeaveRuleWithReports() {
  function enter(node, reporter) {
    if (is(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions enter');
    }
  }

  function leave(node, reporter) {
    if (is(node, 'Definitions')) {
      reporter.report(node.id, 'Definitions leave');
    }
  }

  return {
    check: {
      enter,
      leave
    }
  };
}

function fakeCheckRuleWithoutReports() {
  return { check: () => {} };
}
