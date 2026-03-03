import { requireAdmin } from '@/api/auth.remote';

export const load = async () => {
  requireAdmin();
};
