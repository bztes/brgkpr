import z from 'zod';

export const bootstrapSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});
