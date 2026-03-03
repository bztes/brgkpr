import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { DATA } from '$env/static/private';
import { resolve } from 'path';

if (!DATA) {
  throw new Error('DATA is not set');
}

const client = createClient({ url: `file:${resolve(DATA, 'local.db')}` });

export const db = drizzle(client, { schema });
