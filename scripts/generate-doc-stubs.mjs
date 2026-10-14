/**
 * Generate redirect stubs at <docs/rules/*.md>, pointing to the documentation
 * of the rules that lives in <packages/bpmnlint/docs/rules>.
 *
 * Until bpmnlint@11.15.0, rules linked to
 * <https://github.com/bpmn-io/bpmnlint/blob/main/docs/rules/{rule}.md>.
 * These links are baked into published versions and GitHub does not redirect
 * moved files, so the pages that existed back then must keep pointing
 * to the new location. Newer rules link to <packages/bpmnlint/docs/rules>
 * directly and do not need a stub.
 *
 * Run via <npm run generate-doc-stubs>.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const SOURCE_DIR = 'packages/bpmnlint/docs/rules';
export const STUB_DIR = 'docs/rules';

/**
 * Pages that were documented at <docs/rules> as of bpmnlint@11.15.0.
 * Do not add new pages here.
 */
export const LEGACY_DOCS = [
  'README.md',
  'ad-hoc-sub-process.md',
  'conditional-event.md',
  'conditional-flows.md',
  'end-event-required.md',
  'event-based-gateway.md',
  'event-sub-process-typed-start-event.md',
  'fake-join.md',
  'label-required.md',
  'link-event.md',
  'no-bpmndi.md',
  'no-complex-gateway.md',
  'no-disconnected.md',
  'no-duplicate-sequence-flows.md',
  'no-gateway-join-fork.md',
  'no-implicit-end.md',
  'no-implicit-split.md',
  'no-implicit-start.md',
  'no-inclusive-gateway.md',
  'no-overlapping-elements.md',
  'single-blank-start-event.md',
  'single-event-definition.md',
  'standard-size.md',
  'start-event-required.md',
  'sub-process-blank-start-event.md',
  'superfluous-gateway.md',
  'superfluous-label.md',
  'superfluous-termination.md'
];

export function stubFor(file) {
  const title = file === 'README.md' ? 'Rules' : file.replace(/\.md$/, '');

  return `# ${ title }

This page moved to [${ SOURCE_DIR }/${ file }](../../${ SOURCE_DIR }/${ file }).
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {

  mkdirSync(join(root, STUB_DIR), { recursive: true });

  LEGACY_DOCS.forEach(file => {
    writeFileSync(join(root, STUB_DIR, file), stubFor(file));
  });

  console.log(`generated ${ LEGACY_DOCS.length } stubs in ${ STUB_DIR }`);
}
