import { mockProducts } from '@/test/mocks/product.mock'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

describe('ProductController', () => {
  let controller: ProductController
  let service: ProductService

  beforeEach(() => {
    service = {
      productList: vi.fn().mockResolvedValue(mockProducts),
      findProductsByOwner: vi.fn().mockResolvedValue(mockProducts),
      findProductBySlug: vi.fn().mockResolvedValue(mockProducts[0]),
      findFeaturedProducts: vi.fn().mockResolvedValue([mockProducts[1]]),
      seachProducts: vi.fn().mockResolvedValue(mockProducts),
      uploadProduct: vi.fn().mockResolvedValue(mockProducts[0]),
      featureProduct: vi.fn().mockResolvedValue(undefined),
      removeProduct: vi.fn().mockResolvedValue(undefined),
    } as any
    controller = new ProductController(service)
  })

  it('should list all products', async () => {
    const result = await controller.productList()
    expect(result).toEqual(mockProducts)
    expect(service.productList).toHaveBeenCalled()
  })

  it('should find products by owner', async () => {
    const result = await controller.findProductsByOwner('john')
    expect(result).toEqual(mockProducts)
    expect(service.findProductsByOwner).toHaveBeenCalledWith('john')
  })

  it('should find product by slug', async () => {
    const result = await controller.findProductBySlug('some-slug')
    expect(result).toEqual(mockProducts[0])
    expect(service.findProductBySlug).toHaveBeenCalledWith('some-slug')
  })

  it('should find featured products', async () => {
    const result = await controller.findFeaturedProducts()
    expect(result).toEqual([mockProducts[1]])
    expect(service.findFeaturedProducts).toHaveBeenCalled()
  })

  it('should search products by query', async () => {
    const result = await controller.seachProducts('prod')
    expect(result).toEqual(mockProducts)
    expect(service.seachProducts).toHaveBeenCalledWith('prod')
  })

  it('should throw if search query is empty', async () => {
    try {
      await controller.seachProducts('')
    } catch (e) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'getStatus' in e &&
        typeof (e as any).getStatus === 'function'
      ) {
        expect((e as any).getStatus()).toBe(400)
      } else {
        throw e
      }
    }
  })

  it('should upload product', async () => {
    const file = {
      originalname: 'img.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(''),
    } as any
    const body = {
      title: 'New Product',
      description: 'desc',
      price: 10,
      fileName: 'img.jpg',
    }
    const result = await controller.uploadProduct({ sub: '123' }, body, file)
    expect(result).toEqual(mockProducts[0])
    expect(service.uploadProduct).toHaveBeenCalled()
  })

  it('should feature a product', async () => {
    await controller.featureProduct('1')
    expect(service.featureProduct).toHaveBeenCalledWith('1')
  })

  it('should remove a product', async () => {
    await controller.removeProduct('1')
    expect(service.removeProduct).toHaveBeenCalledWith('1')
  })
})
