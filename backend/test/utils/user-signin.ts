import request from 'supertest'
import { INestApplication } from '@nestjs/common'

export async function createTestUserAndGetToken(app: INestApplication) {
  const response = await request(app.getHttpServer())
    .post('/v1/session/sign-in')
    .send({ nickname: 'john_dee', password: '@Passw0rd' })

  return response.body.access_token
}
