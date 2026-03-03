import z from 'zod';

export const passwordShape = z.string().min(6);

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: passwordShape,
    confirmPassword: passwordShape,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgetPasswordSchema = z.object({
  email: z.email(),
});

export const completeRegistrationSchema = z
  .object({
    token: z.string(),
    password: passwordShape,
    confirmPassword: passwordShape,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
