import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
  vi,
} from 'vitest'
import { PrismaServicePostgres } from '../prisma.service'
import { UserStorage } from './user.storage'
import { S3Storage } from '../../image/s3.service'
import { mockEnv } from '@/test/mocks/env.mock'
import type { SignupBody } from '../../../http/session/user.dto'

describe('UserStorage Integration Tests', () => {
  let prisma: PrismaServicePostgres
  let userStorage: UserStorage

  beforeAll(async () => {
    prisma = new PrismaServicePostgres()
    await prisma.$connect()

    const s3 = new S3Storage(mockEnv)
    vi.spyOn(s3, 'upload').mockResolvedValue({
      url: 'https://fake-s3-url.com/avatar.png',
    })

    const jwtService = {
      signAsync: vi.fn().mockResolvedValue('fake-jwt-token'),
    } as any

    userStorage = new UserStorage(jwtService, prisma, s3)
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  const createDummyUser = (
    overrides: Partial<SignupBody> = {},
  ): SignupBody => ({
    email: 'test@example.com',
    nickname: 'testuser',
    password: 'password123',
    name: 'Test User',
    ...overrides,
  })

  describe('create()', () => {
    it('should create a user successfully and return a token', async () => {
      const userData = createDummyUser()
      const result = await userStorage.create(userData)

      expect(result).not.toHaveProperty('error')
      if ('user' in result) {
        expect(result.access_token).toBe('fake-jwt-token')
        expect(result.user.email).toBe(userData.email)
        const count = await prisma.user.count()
        expect(count).toBe(1)
      }
    })

    it('should return an error if email is already taken', async () => {
      const userData = createDummyUser()
      await userStorage.create(userData)

      const result = await userStorage.create(
        createDummyUser({ nickname: 'another_user' }),
      )

      expect(result).toEqual({ error: true, badEmail: true })
      const count = await prisma.user.count()
      expect(count).toBe(1)
    })

    it('should return an error if nickname is already taken', async () => {
      const userData = createDummyUser()
      await userStorage.create(userData)

      const result = await userStorage.create(
        createDummyUser({ email: 'another@email.com' }),
      )

      expect(result).toEqual({ error: true, badNickname: true })
      const count = await prisma.user.count()
      expect(count).toBe(1)
    })
  })

  describe('find()', () => {
    it('should find a user with correct credentials', async () => {
      const userData = createDummyUser()
      await userStorage.create(userData)

      const result = await userStorage.find({
        email: userData.email,
        password: userData.password,
        nickname: undefined,
      })

      expect(result).not.toHaveProperty('error')
      if ('user' in result) {
        expect(result.user.email).toBe(userData.email)
      }
    })

    it('should return an error for a non-existent user', async () => {
      const result = await userStorage.find({
        email: 'nouser@example.com',
        password: 'password',
        nickname: undefined,
      })
      expect(result).toEqual({ error: true, badUser: true })
    })

    it('should return an error for incorrect password', async () => {
      const userData = createDummyUser()
      await userStorage.create(userData)

      const result = await userStorage.find({
        email: userData.email,
        password: 'wrongpassword',
        nickname: undefined,
      })
      expect(result).toEqual({ error: true, badUser: true })
    })
  })

  describe('updatePassword()', () => {
    it('should update a user password and allow login with the new password', async () => {
      const userData = createDummyUser()
      const created = await userStorage.create(userData)
      const userId = 'user' in created ? created.user.id : ''

      await userStorage.updatePassword(userId, 'newpassword123')

      const loginResult = await userStorage.find({
        email: userData.email,
        password: 'newpassword123',
        nickname: undefined,
      })
      expect(loginResult).not.toHaveProperty('error')

      const oldLoginResult = await userStorage.find({
        email: userData.email,
        password: 'password123',
        nickname: undefined,
      })
      expect(oldLoginResult).toEqual({ error: true, badUser: true })
    })
  })
})
