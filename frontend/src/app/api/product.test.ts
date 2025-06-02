import { describe, it, expect } from 'vitest'
import { getFeaturedProducts, getProduct, searchProducts } from '@/app/api/product'

const sampleSlug = 'john_dee-product_test'
const searchTerm = 'product'
describe('Product API Integration', () => {
  it('should return product by slug', async () => {
    const product = await getProduct(sampleSlug)
    
    expect(product).toBeDefined()
    expect(product).toHaveProperty('slug', sampleSlug)
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
    const results = await searchProducts(searchTerm)
    expect(results).toBeDefined()
    expect(Array.isArray(results)).toBe(true)
    expect(results?.length).toBeGreaterThan(0)
    expect(results?.[0]).toHaveProperty('title')
  })
})