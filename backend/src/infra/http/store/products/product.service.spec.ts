import { ProductService } from './product.service'
import { mockCacheStorage, mockProductStorage } from '@/test/mocks/product.mock'

let service: ProductService

beforeEach(() => {
  vi.clearAllMocks()
  service = new ProductService(
    mockProductStorage as any,
    mockCacheStorage as any,
  )
})

describe('ProductService', () => {
  it('should return all products', async () => {
    mockProductStorage.listProducts.mockResolvedValue([{ id: '1' }])
    const result = await service.productList()
    expect(result).toEqual([{ id: '1' }])
  })

  it('should find products by owner', async () => {
    mockProductStorage.findProductsByOwner.mockResolvedValue([{ id: '2' }])
    const result = await service.findProductsByOwner('john')
    expect(result).toEqual([{ id: '2' }])
  })

  describe('findProductBySlug', () => {
    it('should return product from cache', async () => {
      mockCacheStorage.get.mockResolvedValue(JSON.stringify({ id: 'cached-3' }))

      const result = await service.findProductBySlug('slug-3')
      expect(result).toEqual({ id: 'cached-3' })
      expect(mockCacheStorage.get).toHaveBeenCalledWith('product:slug-3')
      expect(mockProductStorage.findProductBySlug).not.toHaveBeenCalled()
    })

    it('should return product from storage and cache it', async () => {
      mockCacheStorage.get.mockResolvedValue(null)
      mockProductStorage.findProductBySlug.mockResolvedValue({ id: '3' })

      const result = await service.findProductBySlug('slug-3')
      expect(result).toEqual({ id: '3' })
      expect(mockCacheStorage.get).toHaveBeenCalledWith('product:slug-3')
      expect(mockProductStorage.findProductBySlug).toHaveBeenCalledWith(
        'slug-3',
      )
      expect(mockCacheStorage.setex).toHaveBeenCalledWith(
        'product:slug-3',
        60 * 5,
        JSON.stringify({ id: '3' }),
      )
    })
  })

  describe('findFeaturedProducts', () => {
    it('should return featured products from cache', async () => {
      mockCacheStorage.get.mockResolvedValue(
        JSON.stringify([{ id: 'cached-4' }]),
      )

      const result = await service.findFeaturedProducts()
      expect(result).toEqual([{ id: 'cached-4' }])
      expect(mockCacheStorage.get).toHaveBeenCalledWith('featured-products')
      expect(mockProductStorage.findFeaturedProducts).not.toHaveBeenCalled()
    })

    it('should return featured products from storage and cache them', async () => {
      mockCacheStorage.get.mockResolvedValue(null)
      mockProductStorage.findFeaturedProducts.mockResolvedValue([{ id: '4' }])

      const result = await service.findFeaturedProducts()
      expect(result).toEqual([{ id: '4' }])
      expect(mockCacheStorage.get).toHaveBeenCalledWith('featured-products')
      expect(mockProductStorage.findFeaturedProducts).toHaveBeenCalled()
      expect(mockCacheStorage.setex).toHaveBeenCalledWith(
        'featured-products',
        60 * 5,
        JSON.stringify([{ id: '4' }]),
      )
    })
  })

  it('should search products', async () => {
    mockProductStorage.searchProducts.mockResolvedValue([{ id: '5' }])
    const result = await service.searchProducts('searchTerm')
    expect(result).toEqual([{ id: '5' }])
  })
})
