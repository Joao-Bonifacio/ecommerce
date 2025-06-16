import { SellerController } from './seller.controller'
import { SellerService } from './seller.service'
import {
  createMockSellerService,
  MockedService,
} from '@/test/mocks/services.mock'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Product } from '@/prisma/generated/mongo'

describe('SellerController', () => {
  let controller: SellerController
  let sellerService: MockedService<SellerService>

  const mockUserContext = { sub: 'user-id-123', nickname: 'seller_nick' }
  const mockProduct = { id: 'prod-123', title: 'Test Product' } as Product

  beforeEach(() => {
    sellerService = createMockSellerService()
    controller = new SellerController(sellerService as unknown as SellerService)
  })

  describe('uploadProduct', () => {
    const uploadBody = {
      title: 'New Product',
      description: 'A great product',
      price: 100,
      fileName: 'product.png',
    }
    const mockFile: Express.Multer.File = {
      originalname: 'product.png',
      mimetype: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    } as Express.Multer.File

    it('should call the service to upload a product and return the created product', async () => {
      sellerService.uploadProduct.mockResolvedValue(mockProduct)

      const result = await controller.uploadProduct(
        mockUserContext,
        uploadBody,
        mockFile,
      )

      expect(sellerService.uploadProduct).toHaveBeenCalledWith(
        mockUserContext.nickname,
        uploadBody,
        mockFile,
      )
      expect(result).toEqual(mockProduct)
    })

    it('should throw HttpException if the service returns an error', async () => {
      const serviceError = { error: true as const, badNickname: true as const }
      sellerService.uploadProduct.mockResolvedValue(serviceError)

      await expect(
        controller.uploadProduct(mockUserContext, uploadBody, mockFile),
      ).rejects.toThrow(new HttpException(serviceError, HttpStatus.BAD_REQUEST))
    })
  })

  describe('featureProduct', () => {
    it('should call the service to feature a product with the correct parameters', async () => {
      const productId = 'prod-to-feature'
      sellerService.featureProduct.mockResolvedValue(mockProduct)

      await controller.featureProduct(mockUserContext, productId)

      expect(sellerService.featureProduct).toHaveBeenCalledWith(
        productId,
        mockUserContext.nickname,
      )
    })
  })

  describe('removeProduct', () => {
    it('should call the service to remove a product with the correct ID', async () => {
      const productId = 'prod-to-remove'
      sellerService.removeProduct.mockResolvedValue(undefined)

      await controller.removeProduct(productId)

      expect(sellerService.removeProduct).toHaveBeenCalledWith(productId)
    })
  })
})
