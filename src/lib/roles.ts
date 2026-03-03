type UserRoleValue = (typeof userRoleValues)[number];

interface UserRole {
  value: UserRoleValue;
  label: string;
  description: string;
}

export const userRoles: UserRole[] = [
  { value: 'admin', label: 'Admin', description: 'Full access to all settings' },
  {
    value: 'user',
    label: 'User',
    description: 'Access to standard features',
  },
];

export const userRoleValues = Object.freeze(['admin', 'user'] as const);
