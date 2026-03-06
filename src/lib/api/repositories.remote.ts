import { requireUser } from './auth.remote';
import {
  createRepositorySchema,
  deleteRepositorySchema,
  getMyRepositorySchema,
} from '@/api/repositories.schema';
import { db } from '@/server/db';
import { repoTbl } from '@/server/db/schema';
import { safeForm, successResponse, type InferQuery } from '@/remote-functions';
import { normalizePublicKey, repoServerHub } from '@/server/server-config.svelte';
import { takeUniqueOrThrow } from '@/server/db/utils';
import { query } from '$app/server';
import { and, eq } from 'drizzle-orm';
import { requireDefined } from '@/assert';

export type ListMyRepos = InferQuery<typeof listMyRepos>;
export const listMyRepos = query(async () => {
  const user = await requireUser();
  return await db.query.repoTbl.findMany({ where: eq(repoTbl.userId, user.id) });
});

export type getMyRepository = InferQuery<typeof getMyRepository>;
export const getMyRepository = query(getMyRepositorySchema, async ({ id }) => {
  const user = await requireUser();
  return requireDefined(
    await db.query.repoTbl.findFirst({
      where: and(eq(repoTbl.id, id), eq(repoTbl.userId, user.id)),
    }),
  );
});

export const createRepository = safeForm(createRepositorySchema, async (data) => {
  const user = await requireUser();
  const repo = await db
    .insert(repoTbl)
    .values({ ...data, publicKey: normalizePublicKey(data.publicKey), userId: user.id })
    .returning()
    .then(takeUniqueOrThrow);

  const repoServer = await repoServerHub.get(data.serverId);
  await repoServer.addRepoKey(repo);

  return successResponse('Repository created.', repo);
});

export const deleteRepository = safeForm(deleteRepositorySchema, async ({ id }) => {
  const user = await requireUser();
  const repo = await db
    .delete(repoTbl)
    .where(and(eq(repoTbl.id, id), eq(repoTbl.userId, user.id)))
    .returning()
    .then(takeUniqueOrThrow);

  const repoServer = await repoServerHub.get(repo.serverId);
  await repoServer.deleteRepoKey(repo);

  return successResponse('Repository removed.');
});
