import { z } from 'zod'
import { productSchema } from '../product-validate'

export type Product = z.infer<typeof productSchema>
