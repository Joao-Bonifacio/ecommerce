import { z } from 'zod'
import { productSchema, ratingSchema } from '../product-validate'

export type Product = z.infer<typeof productSchema>
export type Rate = z.infer<typeof ratingSchema>
