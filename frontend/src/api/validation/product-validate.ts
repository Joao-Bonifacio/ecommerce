import { z } from 'zod'

export const ratingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  stars: z.number().min(1).max(5),
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
  stock: z.number(),
  ratings: z.array(ratingSchema),
})
export const productFormSchema = z.object({
  title: z.string(),
  price: z.number(),
  description: z.string(),
  fileName: z.string(),
  image: z.instanceof(File),
  stock: z.number(),
})
export const editProductFormSchema = z
  .object({
    title: z.string().optional(),
    price: z.number().optional(),
    description: z.string().optional(),
    fileName: z.string().optional(),
    image: z.instanceof(File).optional(),
    stock: z.number().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.price !== undefined ||
      data.description !== undefined ||
      data.fileName !== undefined ||
      data.image !== undefined ||
      data.stock !== undefined,
    {
      message: 'At least one field must be provided for update',
      path: [],
    },
  )
