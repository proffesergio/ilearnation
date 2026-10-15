import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('GitHub-first orientation, course navigation, edit, feedback, save, restore and clear', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Find your first chapter' }).click();
  await expect(page.getByRole('heading', { name: 'Getting started', exact: true })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Course chapters' })
    .getByRole('link', { name: /Foundations/ })
    .click();
  const editor = page.getByLabel('Welcome.tsx');
  await editor.fill('export default function Welcome() { return <h1>I learn by building.</h1>; }');
  await expect(page.getByRole('heading', { name: 'I learn by building.' })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Run checkpoint' }).click();
  await expect(page.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark chapter read' }).click();
  await page.getByRole('button', { name: 'Save on this device' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Restore saved progress' }).click();
  await expect(page.getByText('1 of 8 chapters marked read')).toBeVisible();
  await page.getByRole('button', { name: 'Clear saved progress' }).click();
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('ilearnnation.progress')),
    ),
  ).toEqual([]);
  await expect(page.getByText('0 of 8 chapters marked read')).toBeVisible();
});

test('home has no serious automated accessibility violations or horizontal overflow', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({
    path: `artifacts/home-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
    nodes: [...document.querySelectorAll('body *')]
      .filter(
        (node) => node.getBoundingClientRect().right > document.documentElement.clientWidth + 1,
      )
      .map((node) => ({
        tag: node.tagName,
        class: String(node.className),
        right: node.getBoundingClientRect().right,
      }))
      .slice(0, 10),
  }));
  expect(overflow.scroll, JSON.stringify(overflow)).toBeLessThanOrEqual(overflow.width);
  await page.getByRole('button', { name: 'Region list', exact: true }).click();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Synthetic demonstration data, dated 16 October 2026')).toBeVisible();
});

test('admin draft editor and policy replay never mutate external data', async ({
  page,
}, testInfo) => {
  await page.goto('/admin');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/admin-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Curriculum', exact: false }).click();
  await page.getByRole('button', { name: 'Validate draft' }).click();
  await expect(page.getByRole('status')).toContainText('Draft manifest is valid');
  await page
    .getByLabel('Markdown source')
    .fill(
      '<script>window.__bad=true</script>\n\n<details>\n<summary>Safe hint</summary>\n\nA useful hint.\n\n</details>\n\n[Bad](javascript:alert(1))',
    );
  const disclosure = page.locator('.markdown-preview').getByText('Safe hint', { exact: true });
  await expect(disclosure).toBeVisible();
  await disclosure.click();
  await expect(page.locator('.markdown-preview').getByText('A useful hint.')).toBeVisible();
  expect(await page.evaluate(() => Object.hasOwn(window, '__bad'))).toBe(false);
  await expect(page.locator('.markdown-preview script')).toHaveCount(0);
  await page.getByRole('button', { name: 'Algorithm lab', exact: false }).click();
  const policy = JSON.parse(await page.getByLabel('Policy draft JSON').inputValue());
  policy.enabled = true;
  await page.getByLabel('Policy draft JSON').fill(JSON.stringify(policy, null, 2));
  await page.getByRole('button', { name: 'Replay synthetic events' }).click();
  await expect(page.getByText('simulated points · 0 applied')).toBeVisible();
  await expect(page.locator('.replay-result')).toContainText('20');
});

test('exercise API rejects cross-origin and unsafe JSX', async ({ request, baseURL }) => {
  const blocked = await request.post('/api/exercises/first-component', {
    headers: { Origin: 'https://untrusted.example' },
    data: { source: 'anything' },
  });
  expect(blocked.status()).toBe(403);
  const valid = await request.post('/api/exercises/first-component', {
    headers: { Origin: baseURL! },
    data: { source: 'export default function Welcome() { return <h1>I learn by building.</h1>; }' },
  });
  expect(valid.status()).toBe(200);
  expect((await valid.json()).passed).toBe(true);
  const malicious = await request.post('/api/exercises/first-component', {
    data: { source: 'while(true){}' },
  });
  expect((await malicious.json()).runnable).toBe(false);
});

test('keyboard checkpoint and reduced-motion route decoration', async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let gifRequests = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('learning-route.gif')) gifRequests++;
  });
  await page.goto('/courses/full-stack-modern-react-nextjs/foundations');
  const editor = page.getByLabel('Welcome.tsx');
  await editor.fill('export default function Welcome() { return <h1>I learn by building.</h1>; }');
  await editor.press('Tab');
  await expect(page.getByRole('button', { name: 'Run checkpoint' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
  await page.getByText('Optional route animation (decorative)', { exact: true }).click();
  await expect(page.locator('picture:has(source) img')).toHaveJSProperty(
    'currentSrc',
    `${baseURL}/api/course-assets/learning-route.svg`,
  );
  expect(gifRequests).toBe(0);
});
