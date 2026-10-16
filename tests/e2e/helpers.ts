import { randomUUID } from 'node:crypto';
import { expect, type Page } from '@playwright/test';
import { createSqliteAdapter, LearningStore } from '../../packages/data/learning-store.mjs';
export async function invitation(email: string, admin = false) {
  const store = new LearningStore(await createSqliteAdapter(process.env.ILEARNNATION_E2E_DB!));
  try {
    if (admin) await store.bootstrapAdmin(email);
    return await store.issueOperatorInvitation(email);
  } finally {
    store.close();
  }
}
export async function seedExportEvents(userId: string, count: number) {
  const adapter = await createSqliteAdapter(process.env.ILEARNNATION_E2E_DB!);
  const ids = Array.from({ length: count }, () => randomUUID());
  try {
    await adapter.batch(
      ids.map((id, index) => ({
        sql: 'INSERT INTO learning_events(id,user_id,course_id,course_version,chapter_id,exercise_id,kind,created_at) VALUES(?,?,?,?,?,?,?,?)',
        values: [
          id,
          userId,
          'full-stack-modern-react-nextjs',
          '0.2.0',
          'foundations',
          'first-component',
          'lesson_read',
          Date.now() + index,
        ],
      })),
    );
    return ids;
  } finally {
    adapter.close?.();
  }
}
export async function signInLearner(
  page: Page,
  name: string,
  options: { email?: string; admin?: boolean } = {},
) {
  const email = options.email || `learner-${randomUUID()}@example.test`;
  const invite = await invitation(email, options.admin);
  await page.goto(`/join#${invite.token}`);
  await expect(page.getByLabel('Invitation code')).toHaveValue(invite.token);
  await page.getByRole('button', { name: 'Accept invitation', exact: true }).click();
  // The client first navigates to /dashboard; the server may then redirect an
  // incomplete profile. Wait for that rendered destination, not the interim URL.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /^(Make this space yours\.|Welcome back,.*)$/,
  );
  if (options.admin) {
    await expect(page).toHaveURL(/\/dashboard$/);
  } else {
    await expect(page).toHaveURL(/\/(profile|dashboard)$/);
    if (page.url().endsWith('/profile')) {
      await page.getByLabel('Display name', { exact: true }).fill(name);
      await page
        .getByLabel('Learning goal', { exact: false })
        .fill('Build and test a useful private notebook.');
      await page.getByRole('button', { name: 'Save profile and continue' }).click();
      await expect(page).toHaveURL(/\/dashboard$/);
    }
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Welcome back,/);
  return { email, invite };
}
export async function expectNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width);
}
