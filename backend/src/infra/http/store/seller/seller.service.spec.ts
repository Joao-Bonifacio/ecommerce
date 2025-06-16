import { SellerService } from './seller.service'
import { ProductStorage } from '@/infra/db/prisma/transactions/product.storage'
import { S3Storage } from '@/infra/db/image/s3.service'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import {
  createMockProductStorage,
  createMockS3Storage,
  createMockUserStorage,
  MockedService,
} from '@/test/mocks/services.mock'
import { HttpException, HttpStatus } from '@nestjs/common'
import { Level, Role } from '@/prisma/generated/postgres'
import { mockFile } from '@/test/mocks/file.mock'

describe('SellerService', () => {
  let service: SellerService
  let productStorage: MockedService<ProductStorage>
  let s3Storage: MockedService<S3Storage>
  let userStorage: MockedService<UserStorage>

  const mockUser = {
    id: 'user-id-123',
    name: 'Seller Name',
    email: 'seller@example.com',
    nickname: 'seller_nick',
    password: 'hashed-password-string',
    level: Level.BRONZE,
    role: Role.SELLER,
    avatar: null,
  }
  const mockProduct = {
    id: 'prod-1',
    owner: 'user-id-123',
    title: 'Sample Product',
    slug: 'sample-product',
    price: 100,
    sales: 0,
    image: 'https://bucket.com/image.jpg',
    description: 'A sample product for testing',
    featured: false,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ratings: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    productStorage = createMockProductStorage()
    s3Storage = createMockS3Storage()
    userStorage = createMockUserStorage()
    service = new SellerService(
      productStorage as unknown as ProductStorage,
      s3Storage as unknown as S3Storage,
      userStorage as unknown as UserStorage,
    )
  })

  describe('uploadProduct', () => {
    it('should successfully upload a product', async () => {
      const productData = {
        title: 'New Gadget',
        description: 'A cool new gadget',
        price: 99.99,
      }
      userStorage.findByNick.mockResolvedValue(mockUser)
      s3Storage.upload.mockResolvedValue({ url: 'https://s3.com/image.jpg' })
      productStorage.uploadProduct.mockResolvedValue({
        id: mockProduct.id,
        owner: mockUser.id,
        title: productData.title,
        slug: 'new-gadget-slug',
        price: productData.price,
        sales: 0,
        image: 'https://s3.com/image.jpg',
        description: productData.description,
        featured: false,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        ratings: [],
      })
      productStorage.uploadProduct.mockImplementation(
        (
          owner: string,
          title: string,
          description: string,
          price: number,
          slug: string,
          image: string,
          stock: number,
        ) =>
          Promise.resolve({
            id: mockProduct.id,
            owner,
            title,
            slug,
            price,
            sales: 0,
            image,
            description,
            featured: false,
            stock,
            createdAt: new Date(),
            updatedAt: new Date(),
            ratings: [],
          }),
      )

      const result = await service.uploadProduct(
        mockUser.nickname,
        productData,
        mockFile,
      )

      expect(s3Storage.upload).toHaveBeenCalled()
      expect(productStorage.uploadProduct).toHaveBeenCalled()
      expect(result).toHaveProperty('id')
    })

    it('should return an error object if the user is not found', async () => {
      userStorage.findByNick.mockResolvedValue(null)

      const result = await service.uploadProduct('unknown_nick', {}, mockFile)

      expect(result).toEqual({ error: true, badNickname: true })
    })

    it('should return an error object if the body or file is missing', async () => {
      expect(
        await service.uploadProduct(
          mockUser.nickname,
          { ...mockFile, createdAt: undefined },
          mockFile,
        ),
      ).toEqual({ error: true, badNickname: true })
      expect(
        await service.uploadProduct(mockUser.nickname, {}, mockFile),
      ).toEqual({ error: true, badNickname: true })
    })
  })

  describe('removeProduct', () => {
    it('should delete the image from S3 and remove the product from storage', async () => {
      productStorage.findProductById.mockResolvedValue(mockProduct)

      await service.removeProduct(mockProduct.id)

      expect(s3Storage.delete).toHaveBeenCalledWith('image.jpg')
      expect(productStorage.removeProduct).toHaveBeenCalledWith(mockProduct.id)
    })

    it('should throw HttpException if the product to remove is not found', async () => {
      productStorage.findProductById.mockResolvedValue({
        error: true,
        badUserBody: true,
      })

      await expect(service.removeProduct('invalid-id')).rejects.toThrow(
        new HttpException(
          { message: 'Product not found' },
          HttpStatus.BAD_REQUEST,
        ),
      )
      expect(s3Storage.delete).not.toHaveBeenCalled()
      expect(productStorage.removeProduct).not.toHaveBeenCalled()
    })
  })
})
