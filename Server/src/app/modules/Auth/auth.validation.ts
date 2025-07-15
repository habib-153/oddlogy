import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    username: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
    mobileNumber: z.string().optional(),
    profilePhoto: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};
