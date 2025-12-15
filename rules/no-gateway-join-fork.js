import {
  is
} from 'bpmnlint-utils';

import {
  annotateRule
} from './helper.js';


/**
 * A rule that checks, whether a gateway forks and joins
 * at the same time.
 *
 * @type { import('../lib/types.js').RuleFactory }
 */
export default function noGatewayJoinForkRule() {

  function check(node, reporter) {

    if (!is(node, 'bpmn:Gateway')) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (incoming.length > 1 && outgoing.length > 1) {
      reporter.report(node.id, 'Gateway forks and joins');
    }
  }

  return annotateRule('no-gateway-join-fork', {
    check
  });

}