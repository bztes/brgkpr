import z from 'zod';

export const createRepositorySchema = z.object({
  name: z.string().nonempty(),
  serverId: z.uuid(),
  publicKey: z.string().nonempty(),
});
