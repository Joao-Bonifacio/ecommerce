import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { PrismaServiceMongo } from '../prisma.service'
import { ProductStorage } from './product.storage'

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

  const createTestProduct = async (slug?: string) => {
    const productSlug = slug || generateUniqueSlug()

    const product = await productStorage.uploadProduct(
      'owner-123',
      'Test Product',
      'Description of product',
      100,
      productSlug,
      'http://image.url/img.jpg',
      1,
    )

    if ('error' in product) {
      throw new Error(
        `Failed to create test product: ${JSON.stringify(product)}`,
      )
    }

    return product
  }

  it('should upload a new product', async () => {
    const product = await createTestProduct()
    expect(product).toHaveProperty('id')
    expect(product.title).toBe('Test Product')
  })

  it('should not allow duplicate slug', async () => {
    const uniqueSlug = generateUniqueSlug()
    await createTestProduct(uniqueSlug)

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

  it('should list all products', async () => {
    await createTestProduct()
    const products = await productStorage.listProducts()
    expect(products).toHaveLength(1)
    expect(products?.[0].title).toBe('Test Product')
  })

  it('should find product by owner', async () => {
    await createTestProduct()
    const products = await productStorage.findProductsByOwner('owner-123')
    expect(products).toHaveLength(1)
    expect(products?.[0].owner).toBe('owner-123')
  })

  it('should find product by id', async () => {
    const product = await createTestProduct()
    const foundProduct = await productStorage.findProductById(product.id)

    if (foundProduct && 'id' in foundProduct) {
      expect(foundProduct.id).toBe(product.id)
    } else {
      throw new Error('Product not found')
    }
  })

  it('should find product by slug', async () => {
    const uniqueSlug = generateUniqueSlug()
    await createTestProduct(uniqueSlug)
    const product = await productStorage.findProductBySlug(uniqueSlug)
    expect(product?.slug).toBe(uniqueSlug)
  })

  it('should feature a product', async () => {
    const product = await createTestProduct()
    const featuredProduct = await productStorage.featureProduct(
      product.id,
      'owner-123',
    )

    if (featuredProduct && 'featured' in featuredProduct) {
      expect(featuredProduct.featured).toBe(true)
    } else {
      throw new Error('Feature operation failed')
    }
  })

  it('should search products', async () => {
    await createTestProduct()
    const products = await productStorage.searchProducts('Test')
    expect(products).toHaveLength(1)
    expect(products?.[0].title).toContain('Test')
  })

  it('should remove a product', async () => {
    const product = await createTestProduct()
    await productStorage.removeProduct(product.id)
    const foundProduct = await productStorage.findProductById(product.id)
    expect(foundProduct).toEqual({ error: true, badProduct: true })
  })
})
