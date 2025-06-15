import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { faker } from '@faker-js/faker'
import { PrismaServiceMongo } from '@/infra/db/prisma/prisma.service'
import { createTestUser } from '../utils/user-auth'
import { createBadProduct, createProduct } from '../utils/create-product'

describe('Seller Controller (E2E)', () => {
  let app: INestApplication
  let prismaMongo: PrismaServiceMongo
  let sellerToken: string
  let sellerNickname: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prismaMongo = moduleRef.get(PrismaServiceMongo)

    await app.init()

    const seller = await createTestUser(app, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      nickname: faker.internet.username(),
      password: '@Passw0rd',
    })
    sellerToken = seller.body.access_token
    sellerNickname = seller.body.user.nickname
  })

  afterAll(async () => {
    await prismaMongo.product.deleteMany({})
    await app.close()
  })

  describe('/seller/upload', () => {
    it('should successfully upload a new product with an image', async () => {
      const response = await createProduct(app, sellerToken)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.owner).toBe(sellerNickname)
      expect(response.body.image).toContain('.jpeg')
    })

    it('should return 400 if file type is invalid', async () => {
      const response = await createBadProduct(app, sellerToken)
      expect(response.status).toBe(400)
      expect(response.body.message).toContain(
        'Validation failed (current file type is text/plain, expected type is .(png|jpg|jpeg))',
      )
    })
  })

  describe(' /seller/edit/:id', () => {
    it('should successfully edit an existing product', async () => {
      const createResponse = await createProduct(app, sellerToken)
      const updatedDescription = 'This is the updated description.'

      const editResponse = await request(app.getHttpServer())
        .patch(`/v1/seller/edit/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ description: updatedDescription })

      expect(editResponse.status).toBe(200)
      expect(editResponse.body.id).toBe(createResponse.body.id)
      expect(editResponse.body.description).toBe(updatedDescription)
    })

    it('should return 400 if another user tries to edit the product', async () => {
      const createResponse = await createTestUser(app, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username(),
        password: '@Passw0rd',
      })
      const productId = createResponse.body.id

      const anotherUser = await createTestUser(app, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username(),
        password: '@Passw0rd',
      })
      const anotherToken = anotherUser.body.access_token

      const editResponse = await request(app.getHttpServer())
        .patch(`/v1/seller/edit/${productId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ description: 'Malicious edit' })

      expect(editResponse.status).toBe(403)
    })
  })

  describe('/seller/remove/:id', () => {
    it('should successfully remove a product', async () => {
      const createResponse = await createProduct(app, sellerToken)

      // console.log(createResponse.body)

      const deleteResponse = await request(app.getHttpServer())
        .delete(`/v1/seller/remove/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${sellerToken}`)

      expect(deleteResponse.status).toBe(204)

      const getResponse = await request(app.getHttpServer()).get(
        `/v1/products/slug/${createResponse.body.slug}`,
      )
      expect(getResponse.status).toBe(404)
    })
  })
})
