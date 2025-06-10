import {
  mockProductStorage,
  mockS3Storage,
  mockUserStorage,
} from '@/test/mocks/product.mock'
import { SellerService } from './seller.service'
import { HttpException } from '@nestjs/common'

let service: SellerService

beforeEach(() => {
  vi.clearAllMocks()
  service = new SellerService(
    mockProductStorage as any,
    mockS3Storage as any,
    mockUserStorage as any,
  )
})

describe('SellerService', () => {
  it('should upload product', async () => {
    const mockFile = {
      originalname: 'img.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from(''),
    } as Express.Multer.File

    mockS3Storage.upload.mockResolvedValue({ url: 'https://image.jpg' })
    mockUserStorage.findByNick.mockResolvedValue({ nickname: 'john_dee' })
    mockProductStorage.uploadProduct.mockResolvedValue({ id: '6' })

    const result = await service.uploadProduct(
      'user-id',
      { title: 'Title', description: 'Desc', price: 10 },
      mockFile,
    )
    expect(result).toEqual({ id: '6' })
  })

  it('should return null if user not found during upload', async () => {
    mockUserStorage.findByNick.mockResolvedValue(null)
    const result = await service.uploadProduct(
      'id',
      { title: '', description: '', price: 0 },
      {} as any,
    )
    expect(result).toStrictEqual({
      badNickname: true,
      error: true,
    })
  })

  it('should feature a product', async () => {
    await service.featureProduct('prod-id', 'john_dee')
    expect(mockProductStorage.featureProduct).toHaveBeenCalledWith(
      'prod-id',
      'john_dee',
    )
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
