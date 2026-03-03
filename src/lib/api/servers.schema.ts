import z from 'zod';

export const getServerSchema = z.object({ serverId: z.uuid() });

export const getServerHealthSchema = z.object({ id: z.uuid() });

export const createServerSchema = z.object({
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().optional().default(22),
  username: z.string().min(1),
  path: z.string().transform((v) => (v === '/' || !v.endsWith('/') ? v : v.slice(0, -1))),
});

export const updateServerSchema = createServerSchema.extend({ id: z.uuid() });

export const deleteServerSchema = z.object({ id: z.uuid() });

export const activateServerSchema = z.object({ id: z.uuid() });
