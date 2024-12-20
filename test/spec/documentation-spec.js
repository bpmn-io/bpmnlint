const getDocumentationUrl = require('../../lib/utils/documentation');
const { expect } = require('chai');

describe('utils/documentation', function() {

  it('should not get URL', function() {

    // given
    const rule = 'camunda-compat/foo';

    // when
    const url = getDocumentationUrl(rule);

    // then
    expect(url).to.be.null;
  });


  [
    [ 'camunda-compat/called-element', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/called-element' ],
    [ 'camunda-compat/element-type', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/element-type' ],
    [ 'camunda-compat/error-reference', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/error-reference' ],
    [ 'camunda-compat/escalation-reference', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/escalation-reference' ],
    [ 'camunda-compat/feel', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/feel' ],
    [ 'camunda-compat/message-reference', 'https://docs.camunda.io/docs/next/components/modeler/reference/modeling-guidance/rules/message-reference' ]
  ].forEach(([ rule, url ]) => {

    it(`should get URL (${ rule })`, function() {

      // when
      // then
      expect(getDocumentationUrl(rule)).to.equal(url);
    });

  });

});