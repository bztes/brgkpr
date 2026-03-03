import { defineConfig } from 'drizzle-kit';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

if (!process.env.DATA) {
  throw new Error('DATA is not set');
}

if (!existsSync(process.env.DATA)) {
  mkdirSync(process.env.DATA, { recursive: true });
}

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: { url: `file:${resolve(process.env.DATA, 'local.db')}` },
  verbose: true,
  strict: true,
});
