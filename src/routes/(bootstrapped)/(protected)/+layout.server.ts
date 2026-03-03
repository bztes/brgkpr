import { requireUser } from '@/api/auth.remote';

export const load = async () => {
  requireUser();
};
