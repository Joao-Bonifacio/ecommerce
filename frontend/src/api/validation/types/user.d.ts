import { z } from 'zod'
import { userSchema } from '../user.validate'

export type User = z.infer<typeof userSchema>
