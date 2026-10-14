import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { expect, stubCJS } from '../helper.mjs';

import {
  LEGACY_DOCS,
  SOURCE_DIR,
  stubFor
} from '../../../../scripts/generate-doc-stubs.mjs';

const {
  __dirname,
  require
} = stubCJS(import.meta.url);

const root = join(__dirname, '../../../..');

const URL_PREFIX = 'https://github.com/bpmn-io/bpmnlint/blob/main/';


describe('docs', function() {

  describe('rule documentation links', function() {

    const rules = readdirSync(join(root, 'packages/bpmnlint/rules'))
      .filter(file => file !== 'helper.js')
      .map(file => file.replace(/\.js$/, ''));

    // rules that link to a page that does not exist (yet)
    const UNDOCUMENTED = [ 'global' ];

    rules.forEach(rule => {

      it(`should link <${ rule }> to existing page`, function() {

        // when
        const { meta } = require(`bpmnlint/rules/${ rule }`)({});

        const url = meta.documentation.url;

        // then
        expect(url).to.eql(`${ URL_PREFIX }${ SOURCE_DIR }/${ rule }.md`);

        if (UNDOCUMENTED.includes(rule)) {
          return;
        }

        expect(existsSync(join(root, url.substring(URL_PREFIX.length))), `${ url } does not exist`).to.be.true;
      });

    });

  });


  describe('stubs for moved pages', function() {

    // links to <docs/rules/{rule}.md> are baked into published versions,
    // and GitHub does not redirect moved files

    LEGACY_DOCS.forEach(file => {

      it(`should redirect <docs/rules/${ file }>`, function() {

        // given
        const stub = join(root, 'docs/rules', file);

        // then
        expect(existsSync(join(root, SOURCE_DIR, file)), `${ SOURCE_DIR }/${ file } missing`).to.be.true;

        expect(existsSync(stub), `docs/rules/${ file } missing, run <npm run generate-doc-stubs>`).to.be.true;

        expect(readFileSync(stub, 'utf8').replace(/\r\n/g, '\n'), `docs/rules/${ file } outdated, run <npm run generate-doc-stubs>`).to.eql(stubFor(file));
      });

    });


    it('should only exist for moved pages', function() {

      // when
      const stubs = readdirSync(join(root, 'docs/rules'));

      // then
      expect(stubs.sort()).to.eql([ ...LEGACY_DOCS ].sort());
    });

  });

});
