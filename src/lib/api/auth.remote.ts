import { command, getRequestEvent, query } from '$app/server';
import { auth } from '@/server/auth';
import { safeForm, successResponse } from '@/remote-functions';
import {
  completeRegistrationSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  signInSchema,
} from '@/api/auth.schema';
import { error, redirect } from '@sveltejs/kit';

export const requireAdmin = query(() => {
  const { locals } = getRequestEvent();
  if (locals.user?.role !== 'admin') {
    error(403);
  }
  return locals.user;
});

export const requireUser = query(() => {
  const { locals, url } = getRequestEvent();
  if (!locals.user) {
    if (url.pathname === '/' || url.pathname === '') {
      throw redirect(302, '/auth/sign-in');
    } else {
      throw redirect(302, `/auth/sign-in?redirectTo=${url.pathname}`);
    }
  }
  return locals.user;
});

export const signIn = safeForm(signInSchema, async (user) => {
  const { request } = getRequestEvent();
  await auth.api.signInEmail({
    body: {
      ...user,
      rememberMe: true,
      callbackURL: '/',
    },
    headers: request.headers,
  });
  return successResponse('Signed in.');
});

export const signOut = command(async () => {
  const { request } = getRequestEvent();
  await auth.api.signOut({
    headers: request.headers,
  });
});

export const resetPassword = safeForm(resetPasswordSchema, async (user) => {
  await auth.api.resetPassword({
    body: {
      newPassword: user.password,
      token: user.token,
    },
  });
  return successResponse('Password reset successful.');
});

export const forgotPassword = safeForm(forgetPasswordSchema, async (user) => {
  await auth.api.requestPasswordReset({
    body: {
      email: user.email,
      redirectTo: '/auth/reset-password',
    },
  });
  return successResponse('Password request successful.');
});

export const completeRegistration = safeForm(completeRegistrationSchema, async (user) => {
  await auth.api.resetPassword({
    body: {
      newPassword: user.password,
      token: user.token,
    },
  });
  return successResponse('Registration completed.');
});
