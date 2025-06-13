import { describe, it, expect } from 'vitest'
import {
  getFeaturedProducts,
  getProduct,
  searchProducts,
} from '@/api/product'

describe('Product API Integration', () => {
  it('should return product by slug', async () => {
    const products = await getFeaturedProducts()
    const { slug } = products![0]
    const product = await getProduct(slug)

    expect(product).toBeDefined()
    expect(product).toHaveProperty('slug', slug)
    expect(product).toHaveProperty('title')
  })
  it('should return featured products list', async () => {
    const products = await getFeaturedProducts()

    expect(products).toBeDefined()
    expect(Array.isArray(products)).toBe(true)
    if (products) {
      expect(products[0]).toHaveProperty('id')
      expect(products[0]).toHaveProperty('title')
    }
  })

  it('should return products by search query', async () => {
    const products = await getFeaturedProducts()
    const slug = products![0].slug.split('-')[0]
    const results = await searchProducts(slug)
    expect(results).toBeDefined()
    expect(Array.isArray(results)).toBe(true)
    expect(results?.length).toBeGreaterThan(0)
    expect(results?.[0]).toHaveProperty('title')
  })
})
