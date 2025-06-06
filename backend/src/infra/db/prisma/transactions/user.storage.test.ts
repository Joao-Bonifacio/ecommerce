import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest'
import { PrismaServicePostgres } from '../prisma.service'
import { UserStorage } from './user.storage'
import { S3Storage } from '../../image/s3.service'
import type { SignupBody, LoginBody } from '../../../http/session/user.dto'
import { mockEnv } from '@/test/mocks/env.mock'

describe('UserStorage Integration Tests', () => {
  let prisma: PrismaServicePostgres
  let s3: S3Storage
  let userStorage: UserStorage
  let createdUserId: string

  beforeAll(async () => {
    prisma = new PrismaServicePostgres()
    await prisma.$connect()

    s3 = new S3Storage(mockEnv)

    vi.spyOn(s3, 'upload').mockImplementation(async () => {
      return { url: 'https://fake-s3-url.com/avatar.png' }
    })

    const jwtService = {
      signAsync: vi.fn().mockResolvedValue('fake-jwt-token'),
    } as any

    userStorage = new UserStorage(jwtService, prisma, s3)

    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  const userData: SignupBody = {
    email: 'test@example.com',
    nickname: 'testuser',
    password: 'password123',
    name: 'name',
  }

  it('should create a user and return UserFetched', async () => {
    const result = await userStorage.create(userData)

    expect(result).toHaveProperty('access_token')
    expect(result).toHaveProperty('user')

    if ('error' in result) {
      throw new Error('Expected successful user creation, got error')
    }

    createdUserId = result.user.id
    expect(result.user.email).toBe(userData.email)
  })

  it('should find user by email and return UserFetched', async () => {
    const loginData: LoginBody = {
      email: userData.email,
      password: userData.password,
      nickname: undefined,
    }

    const result = await userStorage.find(loginData)

    expect(result).toHaveProperty('access_token')
    expect(result).toHaveProperty('user')

    if ('error' in result) {
      throw new Error('Expected successful user find, got error')
    }

    expect(result.user.email).toBe(userData.email)
  })

  it('should find user by id', async () => {
    const user = await userStorage.findById(createdUserId)
    expect(user).not.toBeNull()
    expect(user?.id).toBe(createdUserId)
  })

  it('should update user avatar', async () => {
    await userStorage.updateAvatar(
      createdUserId,
      'avatar.png',
      'image/png',
      Buffer.from('fake-image-content'),
    )

    const user = await userStorage.findById(createdUserId)
    expect(user?.avatar).toBe('https://fake-s3-url.com/avatar.png')
  })

  it('should update user password', async () => {
    await userStorage.updatePassword(createdUserId, 'newpassword123')

    const user = await userStorage.findById(createdUserId)
    expect(user?.password).not.toBe('password123')
    expect(user?.password && user?.password.length).toBeGreaterThan(0)
  })

  it('should delete user', async () => {
    await userStorage.delete(createdUserId)
    const user = await userStorage.findById(createdUserId)
    expect(user).toBeNull()
  })
})
