import { ProductService } from './product.service'
import { HttpException, HttpStatus } from '@nestjs/common'

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

beforeEach(() => {
  vi.clearAllMocks()
  service = new ProductService(
    mockUserStorage as any,
    mockProductStorage as any,
    mockS3Storage as any,
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

  it('should find product by slug', async () => {
    mockProductStorage.findProductBySlug.mockResolvedValue({ id: '3' })
    const result = await service.findProductBySlug('slug-3')
    expect(result).toEqual({ id: '3' })
  })

  it('should return featured products', async () => {
    mockProductStorage.findFeaturedProducts.mockResolvedValue([{ id: '4' }])
    const result = await service.findFeaturedProducts()
    expect(result).toEqual([{ id: '4' }])
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
    const result = await service.uploadProduct('id', { title: '', description: '', price: 0, fileName: '' }, {} as any)
    expect(result).toBeNull()
  })

  it('should feature a product', async () => {
    await service.featureProduct('prod-id')
    expect(mockProductStorage.featureProduct).toHaveBeenCalledWith('prod-id')
  })

  it('should remove a product', async () => {
    mockProductStorage.findProductById.mockResolvedValue({ image: 'https://bucket.com/image.jpg' })
    await service.removeProduct('id')
    expect(mockS3Storage.delete).toHaveBeenCalledWith('image.jpg')
    expect(mockProductStorage.removeProduct).toHaveBeenCalledWith('id')
  })

  it('should throw if product not found when removing', async () => {
    mockProductStorage.findProductById.mockResolvedValue(null)
    await expect(service.removeProduct('invalid-id')).rejects.toThrow(HttpException)
  })
})
