import { createModdleHelper } from '../../../lib/testers/helper.js';

import { expect } from '../../helper.mjs';

import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFileSync } from 'node:fs';


describe('testers/helper', function() {

  class FakeModdle {

    constructor(extensions) {
      this.extensions = extensions;
    }

    async fromXML(xml, elementType, options) {

      return {
        rootElement: { xml, elementType, options },
        warnings: [ 'warning' ]
      };
    }
  }

  const { createModdle, readModdle } = createModdleHelper({
    Moddle: FakeModdle,
    rootType: 'foo:Root'
  });


  describe('#createModdle', function() {

    it('should default <elementType> to root type', async function() {

      // when
      const { root, moddle, warnings, context } = await createModdle('<xml />');

      // then
      expect(moddle).to.be.instanceOf(FakeModdle);
      expect(root).to.eql({
        xml: '<xml />',
        elementType: 'foo:Root',
        options: { lax: true }
      });
      expect(warnings).to.eql([ 'warning' ]);
      expect(context.warnings).to.eql([ 'warning' ]);
    });


    it('should use <elementType>', async function() {

      // when
      const { root } = await createModdle('<xml />', 'foo:Other');

      // then
      expect(root.elementType).to.eql('foo:Other');
    });


    it('should accept <moddleExtensions> as second argument', async function() {

      // given
      const extensions = { ext: {} };

      // when
      const { moddle, root } = await createModdle('<xml />', extensions);

      // then
      expect(moddle.extensions).to.equal(extensions);
      expect(root.elementType).to.eql('foo:Root');
    });


    it('should accept <moddleExtensions> as third argument', async function() {

      // given
      const extensions = { ext: {} };

      // when
      const { moddle } = await createModdle('<xml />', 'foo:Other', extensions);

      // then
      expect(moddle.extensions).to.equal(extensions);
    });

  });


  describe('#readModdle', function() {

    it('should read file', async function() {

      // given
      const file = join(tmpdir(), `lint-core-helper-${ process.pid }.xml`);

      writeFileSync(file, '<file />');

      // when
      const { root } = await readModdle(file);

      // then
      expect(root.xml).to.eql('<file />');
    });

  });

});
