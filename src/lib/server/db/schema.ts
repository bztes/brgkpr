import { randomUUID } from 'crypto';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export * from './auth.schema';

export const serverTbl = sqliteTable('server', {
  id: text('id').primaryKey().$defaultFn(randomUUID),
  name: text('name').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull().default(22),
  username: text('username').notNull(),
  publicKey: text('public_key').notNull(),
  path: text('path').notNull(),
  status: text({ enum: ['new', 'deactivated', 'activated'] })
    .notNull()
    .default('new'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});

export const serverRelations = relations(serverTbl, ({ many }) => ({
  repositories: many(repoTbl),
}));

export const repoTbl = sqliteTable('repo', {
  id: text('id').primaryKey().$defaultFn(randomUUID),
  name: text('name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  serverId: text('server_id')
    .notNull()
    .references(() => serverTbl.id, { onDelete: 'restrict' }),
  publicKey: text('public_key').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
});

export const repoRelations = relations(repoTbl, ({ one }) => ({
  server: one(serverTbl, {
    fields: [repoTbl.serverId],
    references: [serverTbl.id],
  }),
  user: one(user, {
    fields: [repoTbl.userId],
    references: [user.id],
  }),
}));
