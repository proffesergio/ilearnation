import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { getActivity } from '../../packages/course-runtime/activities.mjs';
import { invitation, signInLearner, expectNoOverflow, seedExportEvents } from './helpers';
const course = JSON.parse(
  await readFile(
    new URL('../../courses/full-stack-modern-react-nextjs/course.json', import.meta.url),
    'utf8',
  ),
);
const solutions: Record<string, string> = JSON.parse(
  await readFile(new URL('../fixtures/activity-solutions.json', import.meta.url), 'utf8'),
);

test('astronomical sky pauses, remembers the choice, respects reduced motion and sends no unconfigured analytics', async ({
  page,
}, testInfo) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (/googletagmanager\.com|google-analytics\.com|googlesyndication\.com/.test(request.url()))
      googleRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause sky', exact: true }).click();
  await expect(page.locator('.cosmic-field')).toHaveAttribute('data-paused', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume sky', exact: true })).toBeVisible();
  await page.screenshot({
    path: `artifacts/home-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Resume sky', exact: true }).click();
  await expect(page.locator('.cosmic-field')).toHaveAttribute('data-paused', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.cosmic-field')).toHaveAttribute('data-paused', 'true');
  await expect(page.getByRole('button', { name: 'Pause sky', exact: true })).toHaveCount(0);
  expect(googleRequests).toEqual([]);
  await expectNoOverflow(page);
});

test('public course previews are crawlable and playable; saved progress and later lessons stay protected', async ({
  page,
  request,
  baseURL,
}) => {
  await page.goto('/courses/' + course.id);
  await expect(page.getByRole('heading', { name: course.title, exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    new RegExp('/courses/' + course.id + '$'),
  );
  for (const chapter of course.chapters.slice(0, 3)) {
    await page.goto('/courses/' + course.id + '/' + chapter.id);
    await expect(page.getByRole('heading', { name: chapter.title, exact: true })).toBeVisible();
    await page
      .getByLabel(getActivity(chapter.exerciseId)!.inputLabel, { exact: true })
      .fill(solutions[chapter.exerciseId]);
    await page.getByRole('button', { name: 'Run checkpoint', exact: true }).click();
    await expect(page.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark lesson read', exact: true })).toHaveCount(
      0,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
  }
  await page.goto('/courses/' + course.id + '/' + course.chapters[3].id);
  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
  const input = {
    courseId: course.id,
    courseVersion: course.version,
    chapterId: course.chapters[0].id,
    source: solutions['first-component'],
  };
  expect(
    (
      await request.post('/api/learning', {
        headers: { Origin: baseURL! },
        data: { ...input, kind: 'checkpoint', attemptId: randomUUID() },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post('/api/preview', {
        headers: { Origin: 'https://untrusted.example' },
        data: input,
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/preview', {
        headers: { Origin: baseURL! },
        data: { ...input, chapterId: course.chapters[3].id },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post('/api/preview', {
        headers: { Origin: baseURL! },
        data: { ...input, source: 'x'.repeat(8193) },
      })
    ).status(),
  ).toBe(400);
  expect((await request.get('/api/admin')).status()).toBe(401);
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const chapter of course.chapters.slice(0, 3)) expect(xml).toContain('/' + chapter.id);
  expect(xml).not.toContain('/' + course.chapters[3].id);
  expect(xml).not.toContain('/profile');
  await page.goto('/blog/server-components-or-client-components');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  await expect(
    page.getByRole('contentinfo').getByRole('link', { name: 'Course repository on GitHub' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/proffesergio/modern-fullstack-react-projects-building',
  );
  await expectNoOverflow(page);
});

test('an invited learner completes all twenty bounded checkpoints and resumes on another device', async ({
  page,
  browser,
}) => {
  // This scenario visits twenty complete pages and saves sixty outcomes. Keep
  // individual actions bounded while allowing slower CI hosts to finish it.
  test.setTimeout(300000);
  const { email } = await signInLearner(page, 'Curious Builder');
  await expect(page.getByRole('heading', { name: '0 of 20 checkpoints passed' })).toBeVisible();
  for (const [index, chapter] of course.chapters.entries()) {
    const activity = getActivity(chapter.exerciseId)!;
    await page.goto(`/courses/${course.id}/${chapter.id}`);
    await expect(page.getByRole('heading', { name: activity.title, exact: true })).toBeVisible();
    const editor = page.getByLabel(activity.inputLabel, { exact: true });
    await page.getByRole('button', { name: 'Run checkpoint', exact: true }).click();
    await expect(page.getByText('One more small step', { exact: true })).toBeVisible();
    await editor.fill(solutions[chapter.exerciseId]);
    await page.getByRole('button', { name: 'Run checkpoint', exact: true }).click();
    await expect(page.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Mark lesson read', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Lesson marked read', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(`${index + 1} of 20 checkpoints passed`, { exact: true }),
    ).toBeVisible();
    await expectNoOverflow(page);
  }
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: '20 of 20 checkpoints passed' })).toBeVisible();
  const second = await browser.newContext();
  try {
    const otherDevice = await second.newPage();
    const fresh = await invitation(email);
    await otherDevice.goto(new URL(`/join#${fresh.token}`, page.url()).toString());
    await otherDevice.getByRole('button', { name: 'Accept invitation', exact: true }).click();
    await expect(otherDevice).toHaveURL(/\/dashboard$/);
    await expect(
      otherDevice.getByRole('heading', { name: '20 of 20 checkpoints passed' }),
    ).toBeVisible();
  } finally {
    await second.close();
  }
});

test('admin sees real activity, issues invitations and saves versioned shadow policies', async ({
  page,
  browser,
  baseURL,
}) => {
  await signInLearner(page, 'Administrator', { admin: true });
  await page.goto('/admin');
  const invitedEmail = `invited-${randomUUID()}@example.test`;
  await page.getByLabel('Learner email', { exact: true }).fill(invitedEmail);
  await page.getByRole('button', { name: 'Create invitation', exact: true }).click();
  const link = page.getByLabel('Private one-use invitation link', { exact: true });
  await expect(link).toHaveValue(/\/join#/);
  const newContext = await browser.newContext({ baseURL });
  try {
    const learner = await newContext.newPage();
    await learner.goto(await link.inputValue());
    await learner.getByRole('button', { name: 'Accept invitation', exact: true }).click();
    await expect(learner).toHaveURL(/\/profile$/);
    await learner.getByLabel('Display name', { exact: true }).fill('Invited Explorer');
    await learner.getByRole('button', { name: 'Save profile and continue' }).click();
    await expect(learner).toHaveURL(/\/dashboard$/);
    await expect(
      learner.getByRole('heading', { name: 'Welcome back, Invited Explorer.' }),
    ).toBeVisible();
    await learner.goto(`/courses/${course.id}/foundations`);
    await learner
      .getByLabel(getActivity('first-component')!.inputLabel, { exact: true })
      .fill(solutions['first-component']);
    await learner.getByRole('button', { name: 'Run checkpoint', exact: true }).click();
    await expect(learner.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
    expect((await learner.request.get('/api/admin')).status()).toBe(403);
    await page.reload();
    const row = page.getByRole('row').filter({ hasText: invitedEmail });
    await expect(row).toContainText('1');
    const policy = JSON.parse(await page.getByLabel('Algorithm policy JSON').inputValue());
    policy.enabled = true;
    policy.effectiveFrom = '2000-01-01T00:00:00.000Z';
    await page.getByLabel('Algorithm policy JSON').fill(JSON.stringify(policy, null, 2));
    await page.getByRole('button', { name: 'Save shadow policy', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('saved with an audit record');
    await row.getByRole('button', { name: /View activity/ }).click();
    await expect(page.getByText('10 simulated points · 0 applied', { exact: true })).toBeVisible();
    await expect(page.locator('.admin-detail')).toContainText('checkpoint passed');
    await expectNoOverflow(page);
    await page.goto('/admin/studio');
    await page.getByRole('button', { name: 'Curriculum', exact: false }).click();
    await page.getByRole('button', { name: 'Validate draft', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Draft manifest is valid');
    await page
      .getByLabel('Markdown source')
      .fill(
        '<script>window.__bad=true</script>\n\n<details>\n<summary>Safe hint</summary>\n\nA useful hint.\n\n</details>',
      );
    await page.locator('.markdown-preview').getByText('Safe hint', { exact: true }).click();
    await expect(page.locator('.markdown-preview').getByText('A useful hint.')).toBeVisible();
    expect(await page.evaluate(() => Object.hasOwn(window, '__bad'))).toBe(false);
  } finally {
    await newContext.close();
  }
});

test('profile ownership, same-origin writes, account export and deletion are enforced', async ({
  page,
  baseURL,
}) => {
  await signInLearner(page, 'Private Learner');
  const profile = (await (await page.request.get('/api/profile')).json()).user;
  const escalation = await page.request.put('/api/profile', {
    headers: { Origin: baseURL! },
    data: { displayName: 'Forged', revision: profile.revision, role: 'admin' },
  });
  expect(escalation.status()).toBe(400);
  const crossOrigin = await page.request.put('/api/profile', {
    headers: { Origin: 'https://untrusted.example' },
    data: { displayName: 'Forged', revision: profile.revision },
  });
  expect(crossOrigin.status()).toBe(403);
  const seededIds = await seedExportEvents(profile.id, 1005);
  const exported = await page.request.get('/api/account/download');
  expect(exported.status()).toBe(200);
  const body = await exported.json();
  expect(body.user.id).toBe(profile.id);
  expect(body.events).toHaveLength(1005);
  expect(new Set(body.events.map((event: { id: string }) => event.id)).size).toBe(1005);
  expect(body.events.map((event: { id: string }) => event.id).sort()).toEqual(seededIds.sort());
  expect(JSON.stringify(body)).not.toContain('token_hash');
  const failedDelete = await page.request.delete('/api/account', {
    headers: { Origin: baseURL! },
    data: { confirmation: 'no' },
  });
  expect(failedDelete.status()).toBe(400);
  const deleted = await page.request.delete('/api/account', {
    headers: { Origin: baseURL! },
    data: { confirmation: 'DELETE' },
  });
  expect(deleted.status()).toBe(200);
  expect((await page.request.get('/api/profile')).status()).toBe(401);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/signin$/);
});

test('keyboard activity, progressive hints, reset, and reduced motion remain usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await signInLearner(page, 'Keyboard Learner');
  let gifRequests = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('learning-route.gif')) gifRequests++;
  });
  await page.goto(`/courses/${course.id}/foundations`);
  const editor = page.getByLabel(getActivity('first-component')!.inputLabel, { exact: true });
  await page.getByRole('button', { name: /Reveal hint 1/ }).click();
  await expect(page.locator('.hint-list li')).toHaveCount(1);
  await editor.fill(solutions['first-component']);
  await editor.press('Tab');
  await expect(page.getByRole('button', { name: 'Run checkpoint', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('✓ Checkpoint passed', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset activity', exact: true }).click();
  await expect(editor).toHaveValue(getActivity('first-component')!.starter);
  await expect(page.locator('.cosmic-field')).toHaveAttribute('data-paused', 'true');
  await expect(page.getByRole('button', { name: 'Pause sky' })).toHaveCount(0);
  expect(gifRequests).toBe(0);
});

test('home, accounts, dashboard and a lesson pass representative accessibility and layout checks', async ({
  page,
}, testInfo) => {
  for (const path of ['/', '/signin', '/blog/server-components-or-client-components']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, path).toEqual([]);
    await expectNoOverflow(page);
  }
  await signInLearner(page, 'Accessible Builder');
  for (const path of ['/dashboard', `/courses/${course.id}/javascript-typescript`]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, path).toEqual([]);
    await expectNoOverflow(page);
  }
  await page.screenshot({
    path: `artifacts/course-${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  });
});
