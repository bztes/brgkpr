import { resolve } from '$app/paths';

export const navUser = [
  {
    title: 'Backup',
    path: '#',
    items: [
      {
        title: 'Overview',
        path: resolve('/(bootstrapped)/(protected)'),
      },
      {
        title: 'Repositories',
        path: resolve('/(bootstrapped)/(protected)/repos'),
      },
    ],
  },
];

export const navAdmin = [
  {
    title: 'Admin',
    path: '#',
    items: [
      {
        title: 'Users',
        path: resolve('/(bootstrapped)/(protected)/admin/users'),
      },
      {
        title: 'Servers',
        path: resolve('/(bootstrapped)/(protected)/admin/servers'),
      },
    ],
  },
];
