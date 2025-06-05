import { ProductService } from './product.service'
import { HttpException } from '@nestjs/common'

const mockUserStorage = {
  findById: vi.fn(),
}

const mockProductStorage = {
  listProduct: vi.fn(),
  findProductsByOwner: vi.fn(),
  findProductBySlug: vi.fn(),
  findFeaturedProducts: vi.fn(),
  searchproducts: vi.fn(),
  uploadProduct: vi.fn(),
  featureProduct: vi.fn(),
  findProductById: vi.fn(),
  removeProduct: vi.fn(),
}

const mockS3Storage = {
  upload: vi.fn(),
  delete: vi.fn(),
}

let service: ProductService

const mockCacheStorage = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
}

beforeEach(() => {
  mockCacheStorage.get.mockResolvedValue(JSON.stringify({ id: 'cached-3' }))
  mockCacheStorage.get.mockResolvedValue(JSON.stringify([{ id: 'cached-4' }]))
  vi.clearAllMocks()
  service = new ProductService(
    mockUserStorage as any,
    mockProductStorage as any,
    mockS3Storage as any,
    mockCacheStorage as any,
  )
})

describe('ProductService', () => {
  it('should return all products', async () => {
    mockProductStorage.listProduct.mockResolvedValue([{ id: '1' }])
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
    mockProductStorage.searchproducts.mockResolvedValue([{ id: '5' }])
    const result = await service.seachProducts('searchTerm')
    expect(result).toEqual([{ id: '5' }])
  })

  it('should upload product', async () => {
    const mockFile = {
      originalname: 'img.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(''),
    } as Express.Multer.File

    mockS3Storage.upload.mockResolvedValue({ url: 'https://image.jpg' })
    mockUserStorage.findById.mockResolvedValue({ nickname: 'john' })
    mockProductStorage.uploadProduct.mockResolvedValue({ id: '6' })

    const result = await service.uploadProduct(
      'user-id',
      { title: 'Title', description: 'Desc', price: 10, fileName: 'img.jpg' },
      mockFile,
    )
    expect(result).toEqual({ id: '6' })
  })

  it('should return null if user not found during upload', async () => {
    mockUserStorage.findById.mockResolvedValue(null)
    const result = await service.uploadProduct(
      'id',
      { title: '', description: '', price: 0, fileName: '' },
      {} as any,
    )
    expect(result).toBeNull()
  })

  it('should feature a product', async () => {
    await service.featureProduct('prod-id')
    expect(mockProductStorage.featureProduct).toHaveBeenCalledWith('prod-id')
  })

  it('should remove a product', async () => {
    mockProductStorage.findProductById.mockResolvedValue({
      image: 'https://bucket.com/image.jpg',
    })
    await service.removeProduct('id')
    expect(mockS3Storage.delete).toHaveBeenCalledWith('image.jpg')
    expect(mockProductStorage.removeProduct).toHaveBeenCalledWith('id')
  })

  it('should throw if product not found when removing', async () => {
    mockProductStorage.findProductById.mockResolvedValue(null)
    await expect(service.removeProduct('invalid-id')).rejects.toThrow(
      HttpException,
    )
  })
})
