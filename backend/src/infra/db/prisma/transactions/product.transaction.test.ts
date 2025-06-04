import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { PrismaServiceMongo } from '../prisma.service'
import { ProductStorage } from './product.transaction'

describe('ProductStorage Integration Tests', () => {
  let prisma: PrismaServiceMongo
  let productStorage: ProductStorage
  let createdProductId: string

  beforeAll(async () => {
    prisma = new PrismaServiceMongo()
    await prisma.$connect()

    productStorage = new ProductStorage(prisma)

    // Opcional: limpar dados antes de rodar testes
    await prisma.product.deleteMany()
  })

  afterAll(async () => {
    // Limpar dados após testes, se quiser
    await prisma.product.deleteMany()
    await prisma.$disconnect()
  })

  it('should upload a new product', async () => {
    const product = await productStorage.uploadProduct(
      'owner-123',
      'Test Product',
      'Description of product',
      100,
      'test-product-slug',
      'http://image.url/img.jpg',
    )

    createdProductId = product.id

    expect(product).toHaveProperty('id')
    expect(product.title).toBe('Test Product')
  })

  it('should not allow duplicate slug', async () => {
    await expect(
      productStorage.uploadProduct(
        'owner-123',
        'Another Product',
        'Desc',
        200,
        'test-product-slug', // mesmo slug do produto anterior
        'http://image.url/img2.jpg',
      ),
    ).rejects.toThrow('Slug already exists')
  })

  it('should list all products', async () => {
    const products = await productStorage.listProduct()
    expect(products).toBeInstanceOf(Array)
    expect(products?.length).toBeGreaterThan(0)
  })

  it('should find product by owner', async () => {
    const products = await productStorage.findProductsByOwner('owner-123')
    expect(products).not.toBeNull()
    expect(products?.length).toBeGreaterThan(0)
    expect(products && products[0].owner).toBe('owner-123')
  })

  it('should find product by id', async () => {
    const product = await productStorage.findProductById(createdProductId)
    expect(product).not.toBeNull()
    expect(product?.id).toBe(createdProductId)
  })

  it('should find product by slug', async () => {
    const product = await productStorage.findProductBySlug('test-product-slug')
    expect(product).not.toBeNull()
    expect(product?.slug).toBe('test-product-slug')
  })

  it('should feature a product', async () => {
    await productStorage.featureProduct(createdProductId)
    const product = await productStorage.findProductById(createdProductId)
    expect(product?.featured).toBe(true)
  })

  it('should search products', async () => {
    const products = await productStorage.searchproducts('Test')
    expect(products?.length).toBeGreaterThan(0)
  })

  it('should remove a product', async () => {
    await productStorage.removeProduct(createdProductId)
    const product = await productStorage.findProductById(createdProductId)
    expect(product).toBeNull()
  })
})
