import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { createTestApp } from './setup'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { createTestUserAndGetToken } from '../utils/user-signin'
import { createProduct } from '../utils/create-product'
describe('Product Controller', () => {
  let app: INestApplication
  let token: string
  let productId: string

  beforeAll(async () => {
    app = await createTestApp()
    token = await createTestUserAndGetToken(app)
    const product = await createProduct(app, token)
    productId = product.body.id
    console.log('productId:', productId)
  })

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/v1/products/${productId}`)
    await app.close()
  })

  it('should be able to list products', async () => {
    const response = await request(app.getHttpServer()).get('/v1/products')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  it('should be able to search products', async () => {
    const response = await request(app.getHttpServer()).get(
      '/v1/products/search?q=product',
    )

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should be able to get product by slug', async () => {
    const slug = 'john_dee-tst'
    const response = await request(app.getHttpServer()).get(
      `/v1/products/slug/${slug}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('slug', slug)
  })

  it('should upload a product', async () => {
    const response = await createProduct(app, token)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBeDefined()

    await request(app.getHttpServer())
      .delete(`/v1/products/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
  })
  it('should be able to feature a product', async () => {
    const response = await createProduct(app, token)
    expect(response.status).toBe(201)
  })

  it('should be able to remove a product', async () => {
    const { body } = await createProduct(app, token)
    const response = await request(app.getHttpServer())
      .delete(`/v1/products/remove/${body.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
