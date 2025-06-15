import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { PrismaServiceMongo } from '../prisma.service'
import { ProductStorage } from './product.storage'
import { Product } from '@/prisma/generated/mongo'

describe('ProductStorage Integration Tests', () => {
  let prisma: PrismaServiceMongo
  let productStorage: ProductStorage

  beforeAll(async () => {
    prisma = new PrismaServiceMongo()
    await prisma.$connect()
    productStorage = new ProductStorage(prisma)
  })

  beforeEach(async () => {
    await prisma.product.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const generateUniqueSlug = () =>
    `test-product-${crypto.randomUUID().slice(0, 8)}`

  const createTestProduct = async (data: Partial<Product> = {}) => {
    const productData = {
      owner: 'owner-123',
      title: 'Test Product',
      description: 'Description of product',
      price: 100,
      slug: typeof data.slug === 'string' ? data.slug : generateUniqueSlug(),
      image: 'http://image.url/img.jpg',
      stock: 1,
      ...data,
    }

    const product = await productStorage.uploadProduct(
      productData.owner,
      productData.title,
      productData.description,
      productData.price,
      productData.slug,
      productData.image,
      productData.stock,
    )

    if ('error' in product) {
      throw new Error(
        `Failed to create test product: ${JSON.stringify(product)}`,
      )
    }
    return product
  }

  it('should not allow duplicate slug on upload', async () => {
    const uniqueSlug = generateUniqueSlug()
    await createTestProduct({ slug: uniqueSlug })

    const duplicateProduct = await productStorage.uploadProduct(
      'owner-123',
      'Another Product',
      'Desc',
      200,
      uniqueSlug,
      'http://image.url/img2.jpg',
      1,
    )

    expect(duplicateProduct).toEqual({ error: true, badSlug: true })
  })

  describe('editProduct()', () => {
    it('should edit an existing product', async () => {
      const product = await createTestProduct()
      const updatedData = { title: 'Updated Title', price: 150 }

      const result = await productStorage.editProduct(product.id, updatedData)

      expect(result).not.toHaveProperty('error')
      if ('id' in result) {
        expect(result.title).toBe('Updated Title')
        expect(result.price).toBe(150)
      }
    })

    it('should not allow editing to a slug that already exists', async () => {
      await createTestProduct({ slug: 'slug-1' })
      const product2 = await createTestProduct({ slug: 'slug-2' })

      const result = await productStorage.editProduct(product2.id, {
        slug: 'slug-1',
      })
      expect(result).toEqual({ error: true, badSlug: true })
    })
  })

  describe('featureProduct()', () => {
    it('should feature a product successfully', async () => {
      const product = await createTestProduct({ owner: 'owner-123' })
      const featuredProduct = await productStorage.featureProduct(
        product.id,
        'owner-123',
      )

      expect(featuredProduct).not.toBeNull()
      expect(featuredProduct?.featured).toBe(true)
    })

    it('should return null if trying to feature a product not owned by the user', async () => {
      const product = await createTestProduct({ owner: 'owner-123' })
      const result = await productStorage.featureProduct(
        product.id,
        'another-owner',
      )

      expect(result).toBeNull()
      const refetchedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      })
      expect(refetchedProduct?.featured).toBe(false)
    })

    it('should return null if the product does not exist', async () => {
      const result = await productStorage.featureProduct(
        'non-existent-id',
        'owner-123',
      )
      expect(result).toBeNull()
    })
  })

  describe('removeProduct()', () => {
    it('should remove a product successfully', async () => {
      const product = await createTestProduct()
      await productStorage.removeProduct(product.id)

      const foundProduct = await productStorage.findProductById(product.id)
      expect(foundProduct).toEqual({ error: true, badProduct: true })
    })
  })
})
