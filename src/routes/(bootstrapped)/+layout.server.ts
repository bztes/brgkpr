import { isBootstrapped } from '@/api/bootstrap.remote';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load: LayoutServerLoad = async () => {
  if (!(await isBootstrapped())) {
    redirect(303, resolve('/bootstrap'));
  }
};
