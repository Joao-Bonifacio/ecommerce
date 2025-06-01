import { z } from 'zod'

export const zUploadProductDTO = z.object({
  title: z.string(),
  price: z.number(),
  description: z.string(),
  fileName: z.string(),
})
export type UploadProductBody = z.infer<typeof zUploadProductDTO>

export const zFindProductDTO = z
  .object({
    id: z.string().optional(),
    slug: z.string().min(3).max(20).optional(),
  })
  .refine((data) => data.id || data.slug, {
    message: 'You shold send owner or slug',
    path: ['owner'],
  })

export type FindProductBody = z.infer<typeof zFindProductDTO>
