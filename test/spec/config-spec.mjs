import { expect } from 'chai';

import fs from 'node:fs';

import allConfig from 'bpmnlint/config/all.js';
import correctnessConfig from 'bpmnlint/config/correctness.js';
import recommendedConfig from 'bpmnlint/config/recommended.js';


describe('config', function() {

  describe('all', function() {

    function getDefinedRules(folder) {
      return fs.readdirSync(folder)
        .filter(r => r !== 'helper.js')
        .map(r => r.split('.')[0]);
    }

    it('should contain all lint rules', function() {

      // given
      const definedRules = getDefinedRules('rules');

      // when
      const configuredRules = Object.keys(allConfig.rules);

      // then
      expect(configuredRules).to.eql(definedRules);
    });

  });


  describe('recommended', function() {

    it('should contain relevant lint rules', function() {

      // given
      const expectedRules = {
        'ad-hoc-sub-process': 'error',
        'conditional-flows': 'error',
        'end-event-required': 'error',
        'event-based-gateway': 'error',
        'event-sub-process-typed-start-event': 'error',
        'fake-join': 'warn',
        'global': 'warn',
        'label-required': 'error',
        'link-event': 'error',
        'no-bpmndi': 'error',
        'no-complex-gateway': 'error',
        'no-disconnected': 'error',
        'no-duplicate-sequence-flows': 'error',
        'no-gateway-join-fork': 'error',
        'no-implicit-split': 'error',
        'no-implicit-end': 'error',
        'no-implicit-start': 'error',
        'no-inclusive-gateway': 'warn',
        'no-multi-instance-termination': 'warn',
        'no-overlapping-elements': 'warn',
        'single-blank-start-event': 'error',
        'single-event-definition': 'error',
        'start-event-required': 'error',
        'sub-process-blank-start-event': 'error',
        'superfluous-gateway': 'warn',
        'superfluous-label': 'warn',
        'superfluous-termination': 'warn'
      };

      // when
      const configuredRules = recommendedConfig.rules;

      // then
      expect(configuredRules).to.eql(expectedRules);
    });

  });


  describe('correctness', function() {

    it('should contain relevant lint rules', function() {

      // given
      const expectedRules = [
        'ad-hoc-sub-process',
        'conditional-event',
        'event-based-gateway',
        'event-sub-process-typed-start-event',
        'link-event',
        'no-duplicate-sequence-flows',
        'sub-process-blank-start-event',
        'single-blank-start-event'
      ];

      // when
      const configuredRules = Object.keys(correctnessConfig.rules);

      // then
      expect(configuredRules).to.eql(expectedRules);
    });

  });

});