import request from 'supertest'
import { INestApplication } from '@nestjs/common'

interface LoginWithNick {
  nickname: string
  password: string
}
interface SignUp {
  name: string
  email: string
  nickname: string
  password: string
}

export async function loginTestUser(
  app: INestApplication,
  payload: LoginWithNick,
) {
  const response = await request(app.getHttpServer())
    .post('/v1/session/sign-in')
    .send(payload)

  return response
}

export async function createTestUser(app: INestApplication, payload: SignUp) {
  const response = await request(app.getHttpServer())
    .post('/v1/session/sign-up')
    .send(payload)

  return response
}
