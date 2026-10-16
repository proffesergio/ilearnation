import { getStore } from '../../../../packages/data/learning-store.mjs';
export async function loadAdminData(actorId: string) {
  const store = await getStore();
  const [summary, learners, policy, history] = await Promise.all([
    store.adminSummary(actorId),
    store.listLearners(actorId),
    store.getPolicy(actorId),
    store.listPolicyHistory(actorId),
  ]);
  return { summary, learners, policy, history };
}
export type AdminData = Awaited<ReturnType<typeof loadAdminData>>;
