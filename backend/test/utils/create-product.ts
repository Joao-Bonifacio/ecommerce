import path from 'path'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { faker } from '@faker-js/faker'

export async function createProduct(app: INestApplication, token: string) {
  const imagePath = path.resolve(__dirname, '../image/sample.jpeg')

  const response = await request(app.getHttpServer())
    .post('/v1/seller/upload')
    .set('Authorization', `Bearer ${token}`)
    .field('title', await faker.book.title())
    .field('description', await faker.lorem.text())
    .field('price', 99.99)
    .field('slug', `john_dee-${await faker.lorem.slug()}`)
    .attach('file', imagePath)
  return response
}
