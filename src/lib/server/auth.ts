import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { sendEmail } from './email';
import { admin } from 'better-auth/plugins';
import { ORIGIN } from '$env/static/private';

export const auth = betterAuth({
  baseURL: ORIGIN,
  advanced: { database: { generateId: 'uuid' } },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      if (user.emailVerified) {
        sendEmail({
          to: user.email,
          subject: 'Reset your password',
          html: `<a href='${url}'>Reset Password</a>`,
        });
      } else {
        sendEmail({
          to: user.email,
          subject: 'Welcome',
          html: `<a href='${url}'>Complete Registration</a>`,
        });
      }
    },
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  plugins: [admin(), sveltekitCookies(getRequestEvent)],
});
