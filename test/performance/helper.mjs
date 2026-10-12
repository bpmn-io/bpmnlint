import testRule from '../../lib/test-rule.js';

import { createRule } from '../helper.mjs';

export { expect } from 'chai';

/**
 * Growth factor of the input between the small and the large measurement.
 */
export const SCALE = 8;

/**
 * Maximum ratio between large and small run time we accept.
 *
 * Linear rules grow by ~SCALE, quadratic ones by ~SCALE². We tolerate
 * some super-linear overhead (allocation, GC) but reject quadratic growth.
 */
export const MAX_RATIO = SCALE ** 1.6;


/**
 * Measure how the run time of a rule grows with input size.
 *
 * @param {Object} options
 * @param {Function} options.rule - rule factory
 * @param {(size: number) => Object} options.createModdleRoot
 * @param {number} options.size - size of the small input
 * @param {number} [options.batches=5]
 *
 * @return { {
 *   small: number,
 *   large: number,
 *   ratio: number,
 *   reports: Object[]
 * } }
 */
export function measureScaling({ rule, createModdleRoot, size, batches = 5 }) {
  const smallRoot = createModdleRoot(size);
  const largeRoot = createModdleRoot(size * SCALE);

  // warm up
  measure(rule, smallRoot, batches);

  const small = measure(rule, smallRoot, batches);
  const large = measure(rule, largeRoot, batches);

  return {
    small: small.duration,
    large: large.duration,
    ratio: large.duration / small.duration,
    reports: large.reports
  };
}

/**
 * @param { { small: number, large: number, ratio: number } } scaling
 *
 * @return {string}
 */
export function formatScaling({ small, large, ratio }) {
  return `run time grew ${ ratio.toFixed(1) }x (${ small.toFixed(2) }ms -> ${ large.toFixed(2) }ms) ` +
    `for ${ SCALE }x input, expected below ${ MAX_RATIO.toFixed(1) }x`;
}

// helpers //////////

/**
 * Measure the time a single rule run takes. Repeat the rule until
 * <batchDuration> has elapsed to amortize timer and scheduling noise;
 * take the best of <batches>.
 *
 * @return { { duration: number, reports: Object[] } }
 */
function measure(ruleFactory, moddleRoot, batches, batchDuration = 50) {
  let duration = Infinity;
  let reports;

  for (let i = 0; i < batches; i++) {
    let iterations = 0;

    const start = performance.now();

    do {
      reports = testRule({ moddleRoot, rule: createRule(ruleFactory) });

      iterations++;
    } while (performance.now() - start < batchDuration);

    duration = Math.min(duration, (performance.now() - start) / iterations);
  }

  return { duration, reports };
}
