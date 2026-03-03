import { error } from '@sveltejs/kit';

export async function load({ url }) {
  const token = url.searchParams.get('token');

  if (!token) {
    throw error(400, 'Invalid registration link');
  }

  return { token };
}
