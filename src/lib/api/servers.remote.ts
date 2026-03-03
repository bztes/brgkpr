import { query } from '$app/server';
import { db } from '@/server/db';
import { serversTbl } from '@/server/db/schema';
import { oneAffectedOrThrow, takeUniqueOrThrow } from '@/server/db/utils';
import { eq } from 'drizzle-orm';
import { deleteKey, generateSSHKeyPair } from '@/server/server-keys';
import {
  activateServerSchema,
  createServerSchema,
  deleteServerSchema,
  getServerHealthSchema,
  getServerSchema,
  updateServerSchema,
} from '@/api/servers.schema';
import { redirect } from '@sveltejs/kit';
import { SSH_PASSPHRASE } from '$env/static/private';
import { requireAdmin, requireUser } from './auth.remote';
import { errorResponse, safeForm, successResponse, type InferQuery } from '@/remote-functions';
import { createServerConnection } from '@/server/server-connection';
import { requireDefined } from '@/assert';

export type ListMyServersType = InferQuery<typeof listMyServers>;
export const listMyServers = query(async () => {
  await requireUser();
  return await db.query.serversTbl.findMany();
});

export type ListServersType = InferQuery<typeof listServers>;
export const listServers = query(async () => {
  await requireAdmin();
  return await db.query.serversTbl.findMany();
});

export type GetServerType = InferQuery<typeof getServer>;
export const getServer = query(getServerSchema, async ({ serverId }) => {
  await requireAdmin();
  return requireDefined(
    await db.query.serversTbl.findFirst({ where: eq(serversTbl.id, serverId) }),
  );
});

export const createServer = safeForm(createServerSchema, async (data) => {
  await requireAdmin();
  const sshKey = await generateSSHKeyPair(SSH_PASSPHRASE);
  const server = await db
    .insert(serversTbl)
    .values({ ...data, ...sshKey })
    .returning()
    .then(takeUniqueOrThrow);
  redirect(303, `/admin/servers/${server.id}`);
});

export const updateServer = safeForm(updateServerSchema, async ({ id, ...data }) => {
  await requireAdmin();
  await db.update(serversTbl).set(data).where(eq(serversTbl.id, id)).then(oneAffectedOrThrow);
  return successResponse('Server settings saved.');
});

export const deleteServer = safeForm(deleteServerSchema, async ({ id }) => {
  await requireAdmin();
  await db.delete(serversTbl).where(eq(serversTbl.id, id)).then(oneAffectedOrThrow);
  await deleteKey(id);
  return successResponse('Server removed.');
});

export const getServerHealth = query(getServerHealthSchema, async ({ id }) => {
  await requireAdmin();
  const serverConn = await createServerConnection(id);
  return await serverConn.checkHealth();
});

export const activateServer = safeForm(activateServerSchema, async ({ id }) => {
  await requireAdmin();
  const serverConn = await createServerConnection(id);
  const serverHealth = await serverConn.checkHealth();
  if (serverHealth.every((e) => e.healthy)) {
    await db
      .update(serversTbl)
      .set({ status: 'activated' })
      .where(eq(serversTbl.id, id))
      .then(oneAffectedOrThrow);
    return successResponse('Server activated.');
  }
  return errorResponse("Server couldn't be activated.", serverHealth);
});
