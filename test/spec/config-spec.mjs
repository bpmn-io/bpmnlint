import { expect } from 'chai';

import fs from 'node:fs';

import allConfig from 'bpmnlint/config/all.js';
import correctnessConfig from 'bpmnlint/config/correctness.js';


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


  describe('correctness', function() {

    it('should contain relevant lint rules', function() {

      // given
      const expectedRules = [
        'ad-hoc-sub-process',
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