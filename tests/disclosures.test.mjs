import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeDisclosures } from '../packages/course-runtime/disclosures.mjs';
test('only exact, text-summary disclosures are converted to trusted elements', () => {
  const paragraph = {
    type: 'paragraph',
    children: [{ type: 'text', value: 'A progressive hint.' }],
  };
  const tree = {
    children: [
      { type: 'html', value: '<details>\n<summary>Hint 1</summary>' },
      paragraph,
      { type: 'html', value: '</details>' },
    ],
  };
  safeDisclosures()(tree);
  assert.equal(tree.children[0].data.hName, 'details');
  assert.equal(tree.children[0].children[0].data.hName, 'summary');
  assert.equal(tree.children[0].children[1], paragraph);
  for (const raw of [
    '<details onclick="alert(1)"><summary>Hint</summary>',
    '<details><summary><script>bad</script></summary>',
    '<img src="https://tracker.test/x">',
  ]) {
    const hostile = { children: [{ type: 'html', value: raw }] };
    safeDisclosures()(hostile);
    assert.equal(hostile.children[0].type, 'html');
    assert.equal(hostile.children[0].data, undefined);
  }
});
