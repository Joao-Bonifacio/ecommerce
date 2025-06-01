import { z } from 'zod'

export const zSignupDTO = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  nickname: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
})
export type SignupBody = z.infer<typeof zSignupDTO>

export const zLoginByNickDTO = z.object({
  nickname: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
})

export const zSigninDTO = z
  .object({
    email: z.string().email().optional(),
    nickname: z.string().min(3).max(20).optional(),
    password: z.string().min(8).max(20),
  })
  .refine((data) => data.email || data.nickname, {
    message: 'You shold send email or nickname',
    path: ['email'],
  })

export type LoginBody = z.infer<typeof zSigninDTO>
