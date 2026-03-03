import { userRoleValues } from '@/roles';
import { z } from 'zod';

export const getUserSchema = z.object({ userId: z.uuid() });

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(userRoleValues),
  invite: z.coerce.boolean<boolean>(),
});

export const updateUserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  role: z.enum(userRoleValues),
});

export const inviteUserSchema = z.object({ email: z.email() });

export const deleteUserSchema = z.object({ id: z.uuid(), redirectPath: z.string().optional() });
