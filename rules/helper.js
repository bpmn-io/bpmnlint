
/**
 * Create a checker that disallows the given element type.
 *
 * @param {String} type
 *
 * @return {Function} ruleImpl
 */
function disallowNodeType(type) {

  return function(utils) {

    const is = utils.is;

    function check(node, reporter) {

      if (is(node, type)) {
        reporter.report(node.id, 'has disallowed type <' + type + '>');
      }
    }

    return {
      check
    };

  };

}

module.exports.disallowNodeType = disallowNodeType;