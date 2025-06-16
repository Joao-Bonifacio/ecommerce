import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getAllProducts,
  getFeaturedProducts,
  getProduct,
  searchProducts,
} from '@/api/product'

describe('Product API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a product by slug', async () => {
    const products = await getAllProducts()
    expect(products).toBeDefined()
    expect(Array.isArray(products)).toBe(true)
    expect(products?.length).toBeGreaterThan(0)

    const { slug } = products![0]
    const product = await getProduct(slug)

    expect(product).toBeDefined()
    expect(product).toHaveProperty('slug', slug)
    expect(product).toHaveProperty('title')
  })

  it('should return a list of featured products', async () => {
    const products = await getFeaturedProducts()

    expect(products).toBeDefined()
    expect(Array.isArray(products)).toBe(true)

    if (products && products.length > 0) {
      expect(products[0]).toHaveProperty('id')
      expect(products[0]).toHaveProperty('title')
    }
  })

  it('should return products matching search query', async () => {
    const products = await getAllProducts()
    expect(products).toBeDefined()
    expect(Array.isArray(products)).toBe(true)
    expect(products?.length).toBeGreaterThan(0)

    const slugPart = products![0].slug.split('-')[1]
    const results = await searchProducts(slugPart)

    expect(results).toBeDefined()
    expect(Array.isArray(results)).toBe(true)
    expect(results?.length).toBeGreaterThan(0)
    expect(results?.[0]).toHaveProperty('title')
  })
})
