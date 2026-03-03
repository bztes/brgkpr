import { requireUser } from './auth.remote';
import { createRepositorySchema } from '@/api/repositories.schema';
import { db } from '@/server/db';
import { reposTbl } from '@/server/db/schema';
import { safeForm, successResponse, type InferQuery } from '@/remote-functions';
import { createServerConnection } from '@/server/server-connection';
import { takeUniqueOrThrow } from '@/server/db/utils';
import { query } from '$app/server';
import { eq } from 'drizzle-orm';

export type ListMyRepos = InferQuery<typeof listMyRepos>;
export const listMyRepos = query(async () => {
  const user = await requireUser();
  return await db.query.reposTbl.findMany({ where: eq(reposTbl.userId, user.id) });
});

export const createRepository = safeForm(createRepositorySchema, async (data) => {
  const user = await requireUser();
  const repo = await db
    .insert(reposTbl)
    .values({ ...data, userId: user.id })
    .returning()
    .then(takeUniqueOrThrow);

  const ssh = await createServerConnection(data.serverId);
  await ssh.addRepoKey(repo);

  return successResponse('Repository created.', repo);
});
