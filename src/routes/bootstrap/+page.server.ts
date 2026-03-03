import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isBootstrapped } from '@/api/bootstrap.remote';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async () => {
  if (await isBootstrapped()) {
    redirect(303, resolve('/(bootstrapped)'));
  }
};
