import { z } from 'zod'

export const ratingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
})
export const productSchema = z.object({
  id: z.string().uuid(),
  owner: z.string(),
  title: z.string(),
  slug: z.string(),
  price: z.number(),
  sales: z.number(),
  image: z.string(),
  description: z.string(),
  featured: z.boolean(),
  ratings: z.array(ratingSchema),
})
