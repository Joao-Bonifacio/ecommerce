import { api } from '@/app/api/api-wrapper'
import { type Product } from '@/app/api/validation/types/product'

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api('/products/featured', {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  })
  const products = await response.json()

  return products
}
