import { z } from 'zod'

const LevelEnum = z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'])
const RoleEnum = z.enum(['CUSTUMER', 'SELLER', 'ADMIN'])

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  nickname: z.string(),
  level: LevelEnum.default('BRONZE'),
  role: RoleEnum.default('CUSTUMER'),
  avatar: z.string().url().optional(),
})

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, 'Current password must be at least 8 characters long')
    .max(64, 'Current password must be at most 64 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  newPassword: z
    .string()
    .min(8, 'Current password must be at least 8 characters long')
    .max(64, 'Current password must be at most 64 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
})
