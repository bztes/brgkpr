import { getRequestEvent, query } from '$app/server';
import { auth } from '@/server/auth';
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  inviteUserSchema,
  updateUserSchema,
} from '@/api/users.schema';
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from './auth.remote';
import { safeForm, successResponse, type InferQuery } from '@/remote-functions';
import type { UserWithRole } from '@/user';

export type ListUsersResponse = InferQuery<typeof listUsers>;
export const listUsers = query(async () => {
  await requireAdmin();
  const { request } = getRequestEvent();
  const { users } = await auth.api.listUsers({ query: {}, headers: request.headers });
  return users;
});

export type GetUserResponse = InferQuery<typeof getUser>;
export const getUser = query(getUserSchema, async ({ userId }) => {
  await requireAdmin();
  const { request } = getRequestEvent();
  const user = (await auth.api.getUser({
    query: { id: userId },
    headers: request.headers,
  })) as UserWithRole;

  return user;
});

export const createUser = safeForm(createUserSchema, async (user) => {
  await requireAdmin();
  await auth.api.createUser({
    body: {
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
    },
  });

  if (user.invite) {
    await auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: '/auth/complete-registration',
      },
    });
  }
  return successResponse('User created.');
});

export const updateUser = safeForm(updateUserSchema, async ({ id: userId, ...data }) => {
  await requireAdmin();
  const { request } = getRequestEvent();
  await auth.api.adminUpdateUser({ body: { userId, data }, headers: request.headers });
  return successResponse('User updated.');
});

export const inviteUser = safeForm(inviteUserSchema, async ({ email }) => {
  await requireAdmin();
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: '/auth/reset-password',
    },
  });
  return successResponse('User invitation send.');
});

export const deleteUser = safeForm(deleteUserSchema, async ({ id: userId, redirectPath }) => {
  await requireAdmin();
  const { request } = getRequestEvent();
  await auth.api.removeUser({ body: { userId }, headers: request.headers });
  if (redirectPath) {
    redirect(303, redirectPath);
  }
  return successResponse('User deleted.');
});
