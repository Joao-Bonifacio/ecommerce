import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import { createTestApp } from '../e2e/setup'
import { createTestUser, loginTestUser } from '../utils/user-auth'

describe('User Controller', () => {
  let app: INestApplication
  let token: string
  let nickname: string
  let password: string

  beforeAll(async () => {
    app = await createTestApp()
    password = faker.internet.password()
    const response = await createTestUser(app, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      nickname: faker.internet.username(),
      password,
    })
    nickname = response.body.user.nickname
    token = response.body.access_token
  })

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete('/v1/session')
      .set('Authorization', `Bearer ${token}`)

    await app.close()
  })

  it('should be able to sign-up a user', async () => {
    const response = await createTestUser(app, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      nickname: faker.internet.username(),
      password: faker.internet.password(),
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('user')

    await request(app.getHttpServer())
      .delete('/v1/session')
      .set('Authorization', `Bearer ${response.body.access_token}`)
  })

  it('should be able to sign-in a user and get token and user', async () => {
    const response = await loginTestUser(app, { nickname, password })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('user')
  })

  it('should be able to get current user profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/session/current')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('nickname')
  })

  it('should be able to delete a user', async () => {
    const response = await createTestUser(app, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      nickname: faker.internet.username(),
      password: faker.internet.password(),
    })

    const tempToken = response.body.access_token

    const deleteResponse = await request(app.getHttpServer())
      .delete('/v1/session')
      .set('Authorization', `Bearer ${tempToken}`)

    expect(deleteResponse.status).toBe(204)
  })
})
