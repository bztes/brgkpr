import { error } from '@sveltejs/kit';

export async function load({ url }) {
  const token = url.searchParams.get('token');

  if (!token) {
    throw error(400, 'Invalid reset password link');
  }

  return { token };
}
