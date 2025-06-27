import { beforeAll, beforeEach, afterAll, describe, it, expect } from 'vitest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { faker } from '@faker-js/faker'
import { PrismaServicePostgres } from '@/infra/db/prisma/prisma.service'
import { createTestUser } from '../utils/user-auth'

describe('Session Controller (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaServicePostgres

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaServicePostgres)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    await app.close()
  })

  describe(' /session/sign-up', () => {
    it('should create a new user and return an access token', async () => {
      const signUpData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username().toLowerCase(),
        password: faker.internet.password({ length: 10 }),
      }

      const response = await request(app.getHttpServer())
        .post('/v1/session/sign-up')
        .send(signUpData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('access_token')
      expect(response.body.user.email).toBe(signUpData.email)
      expect(response.body.user.password).toBeUndefined()
    })

    it('should return 400 if email is already in use', async () => {
      const email = faker.internet.email()
      const firstUserData = {
        name: faker.person.fullName(),
        email,
        nickname: faker.internet.username().toLowerCase(),
        password: faker.internet.password({ length: 10 }),
      }
      await request(app.getHttpServer())
        .post('/v1/session/sign-up')
        .send(firstUserData)

      const secondUserData = {
        ...firstUserData,
        nickname: faker.internet.username().toLowerCase(),
      }
      const response = await request(app.getHttpServer())
        .post('/v1/session/sign-up')
        .send(secondUserData)

      expect(response.status).toBe(400)
    })
  })

  describe(' /session/sign-in', () => {
    it('should authenticate a user and return an access token', async () => {
      const { body } = await createTestUser(app, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username().toLowerCase(),
        password: '@Passw0rd',
      })
      const { user } = body

      const response = await request(app.getHttpServer())
        .post('/v1/session/sign-in')
        .send({
          nickname: user.nickname,
          password: '@Passw0rd',
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('access_token')
      expect(response.body.user.nickname).toBe(user.nickname)
    })

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/session/sign-in')
        .send({
          nickname: 'nonexistentuser',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(400)
    })
  })

  describe(' /session/current', () => {
    it('should return the current user profile with a valid token', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username().toLowerCase(),
        password: '@Passw0rd',
      }
      const signUpResponse = await request(app.getHttpServer())
        .post('/v1/session/sign-up')
        .send(userData)
      const token = signUpResponse.body.access_token

      const profileResponse = await request(app.getHttpServer())
        .get('/v1/session/current')
        .set('Authorization', `Bearer ${token}`)

      expect(profileResponse.status).toBe(200)
      expect(profileResponse.body.email).toBe(userData.email)
    })

    it('should return 401 if no token is provided', async () => {
      const response = await request(app.getHttpServer()).get(
        '/v1/session/current',
      )
      expect(response.status).toBe(401)
    })
  })
})
