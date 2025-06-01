import { z } from 'zod'

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces'),
  email: z
    .string()
    .email('Invalid email address')
    .max(70, 'Email must be at most 70 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(60, 'Password must be at most 60 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
})

export const signInSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .min(10, 'Email must be at least 10 characteres')
      .max(70, 'Email must be at most 70 characteres')
      .optional(),
    nickname: z
      .string()
      .min(5, 'Nickname must be at least 5')
      .max(20, 'Nickname must be at most 20 characteres')
      .optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(60, 'Password must be at most 60 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  })
  .refine((data) => data.email || data.nickname, {
    message: 'You shold send email or nickname',
    path: ['email'],
  })
