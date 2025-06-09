import { mockProducts } from '@/test/mocks/product.mock'
import { SellerController } from './seller.controller'
import { SellerService } from './seller.service'

describe('Seller ', () => {
  let controller: SellerController
  let service: SellerService

  beforeEach(() => {
    service = {
      uploadProduct: vi.fn().mockResolvedValue(mockProducts[0]),
      featureProduct: vi.fn().mockResolvedValue(undefined),
      removeProduct: vi.fn().mockResolvedValue(undefined),
    } as any
    controller = new SellerController(service)
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
    const result = await controller.uploadProduct(
      { sub: '123', nickname: 'jown_dee' },
      body,
      file,
    )
    expect(result).toEqual(mockProducts[0])
    expect(service.uploadProduct).toHaveBeenCalled()
  })

  it('should edit product', async () => {})

  it('should feature a product', async () => {
    await controller.featureProduct({ sub: '123', nickname: 'jown_dee' }, '1')
    expect(service.featureProduct).toHaveBeenCalledWith('1', 'jown_dee')
  })

  it('should remove a product', async () => {
    await controller.removeProduct('1')
    expect(service.removeProduct).toHaveBeenCalledWith('1')
  })
})
