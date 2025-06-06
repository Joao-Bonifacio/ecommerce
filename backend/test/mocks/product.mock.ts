import { vi } from 'vitest'

export const mockUserStorage = {
  findById: vi.fn(),
}

export const mockProductStorage = {
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

export const mockS3Storage = {
  upload: vi.fn(),
  delete: vi.fn(),
}

export const mockCacheStorage = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
}

export const mockProducts = [
  { id: crypto.randomUUID(), title: 'Product 1' },
  { id: crypto.randomUUID(), title: 'Product 2' },
] as any
