import { query } from '$app/server';
import { bootstrapSchema } from '@/api/bootstrap.schema';
import { auth } from '@/server/auth';
import { redirect } from '@sveltejs/kit';
import { db } from '@/server/db';
import { sql } from 'drizzle-orm';
import { safeForm, successResponse } from '@/remote-functions';
import { user } from '@/server/db/auth.schema';

let bootstrapped = false;

export const isBootstrapped = query(async () => {
  if (!bootstrapped) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(user);
    bootstrapped = count > 0;
  }
  return bootstrapped;
});

export const bootstrap = safeForm(bootstrapSchema, async (data) => {
  if (await isBootstrapped()) {
    redirect(303, '/');
  }

  await auth.api.createUser({
    body: {
      ...data,
      role: 'admin',
    },
  });

  return successResponse('Setup completed.');
});
