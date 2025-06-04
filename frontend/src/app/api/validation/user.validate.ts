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
