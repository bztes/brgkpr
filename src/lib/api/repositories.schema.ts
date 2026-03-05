import z from 'zod';

export const createRepositorySchema = z.object({
  name: z.string().nonempty(),
  serverId: z.uuid(),
  publicKey: z.string().nonempty(),
});

export const getMyRepositorySchema = z.object({ id: z.uuid() });

export const deleteRepositorySchema = z.object({ id: z.uuid() });
