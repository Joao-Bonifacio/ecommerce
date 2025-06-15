import type { Mock } from 'vitest'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import { ProductService } from '@/infra/http/store/products/product.service'
import { SellerService } from '@/infra/http/store/seller/seller.service'
import { ProductStorage } from '@/infra/db/prisma/transactions/product.storage'
import { S3Storage } from '@/infra/db/image/s3.service'
import { CacheStorage } from '@/infra/db/cache/cache.service'

// A generic type for a mocked service
export type MockedService<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? Mock<T[K]> : T[K]
}

export const createMockUserStorage = (): MockedService<UserStorage> => ({
  find: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  updatePassword: vi.fn(),
  updateAvatar: vi.fn(),
  findByNick: vi.fn(),
})

export const createMockProductService = (): MockedService<ProductService> => ({
  productList: vi.fn(),
  findProductsByOwner: vi.fn(),
  findProductBySlug: vi.fn(),
  findFeaturedProducts: vi.fn(),
  searchProducts: vi.fn(),
  ratingProduct: vi.fn(),
})

export const createMockSellerService = (): MockedService<SellerService> => ({
  findMyProducts: vi.fn(),
  uploadProduct: vi.fn(),
  editProduct: vi.fn(),
  featureProduct: vi.fn(),
  removeProduct: vi.fn(),
  generateSlug: vi.fn(), // Also mock public methods if needed for other tests
})

export const createMockProductStorage = (): MockedService<ProductStorage> => ({
  listProducts: vi.fn(),
  findProductsByOwner: vi.fn(),
  findProductBySlug: vi.fn(),
  findFeaturedProducts: vi.fn(),
  searchProducts: vi.fn(),
  rateProduct: vi.fn(),
  uploadProduct: vi.fn(),
  editProduct: vi.fn(),
  featureProduct: vi.fn(),
  removeProduct: vi.fn(),
  findProductById: vi.fn(),
})

export const createMockS3Storage = (): MockedService<S3Storage> => ({
  upload: vi.fn(),
  delete: vi.fn(),
})

export const createMockCacheStorage = (): MockedService<CacheStorage> =>
  ({
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
  } as Partial<MockedService<CacheStorage>> as MockedService<CacheStorage>)