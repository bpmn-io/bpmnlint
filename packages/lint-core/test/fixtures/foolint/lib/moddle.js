/**
 * A tiny fake of a moddle, parsing "documents" of the form
 *
 *   <root id="ID" [warn] [broken] [ext] />
 */
function FooModdle(extensions) {
  this.extensions = extensions;
}

FooModdle.prototype.fromXML = async function(xml) {

  if (xml.includes('broken')) {
    throw new Error('unparsable');
  }

  const id = /id="([^"]*)"/.exec(xml)[1];

  const rootElement = {
    $type: 'foo:Root',
    id,
    flags: Object.keys(this.extensions || {}),
    xml,
    $descriptor: { properties: [] },
    $instanceOf: (type) => type === 'foo:Root'
  };

  const warnings = xml.includes('warn') ? [
    { message: 'unexpected attribute\nsecond line', element: { id: 'Warning_1' } }
  ] : [];

  return { rootElement, warnings };
};

module.exports = FooModdle;
