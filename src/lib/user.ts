import type { UserWithRole as UserWithRoleBetterAuth } from 'better-auth/plugins';

export const userRoleValues = Object.freeze(['admin', 'user'] as const);

export interface UserWithRole extends UserWithRoleBetterAuth {
  role: (typeof userRoleValues)[number];
}
