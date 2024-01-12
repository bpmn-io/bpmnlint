import { expect } from 'chai';

import fs from 'node:fs';

import allConfig from 'bpmnlint/config/all.js';


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

});