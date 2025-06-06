import { SessionController } from './session.controller'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import { HttpException } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { Level, Role } from '@/prisma/generated/postgres'

describe('SessionController', () => {
  let controller: SessionController
  let userStorage: UserStorage

  beforeEach(() => {
    userStorage = {
      find: vi.fn(),
      create: vi.fn(),
    } as any

    controller = new SessionController(userStorage)
  })
  describe('sign-up', () => {
    it('should sign-up and return jwt token and user without password', async () => {
      const body = {
        name: 'John',
        email: 'john@example.com',
        nickname: 'johnny',
        password: '123456',
      }

      userStorage.create = vi.fn().mockResolvedValueOnce({
        access_token: 'access-token',
        user: {
          id: 'user-id',
          name: 'John',
          email: 'john@example.com',
          nickname: 'johnny',
          password: 'hashed-password',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
        },
      })

      const result = await controller.create(body)

      expect(result).toEqual({
        access_token: 'access-token',
        user: {
          id: 'user-id',
          name: 'John',
          email: 'john@example.com',
          nickname: 'johnny',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
          password: undefined,
        },
      })
    })

    it('should throw HttpException if create returns error', async () => {
      const body = {
        name: 'John',
        email: 'used@example.com',
        nickname: 'johnny',
        password: '123456',
      }

      userStorage.create = vi.fn().mockResolvedValueOnce({
        error: true,
        emailPushDB: false,
      })

      await expect(controller.create(body)).rejects.toThrow(HttpException)
    })
  })

  describe('sign-in', () => {
    it('should sign-in and return jwt token and user without password', async () => {
      const password = '@Passw0rd'
      const hashed = await hash(password, 8)

      const body = {
        email: 'john@example.com',
        password,
        nickname: undefined,
      }

      userStorage.find = vi.fn().mockResolvedValueOnce({
        access_token: 'login-token',
        user: {
          id: 'existing-user-id',
          name: 'Existing User',
          email: 'john@example.com',
          nickname: 'johnny',
          password: hashed,
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
        },
      })

      const result = await controller.match(body)

      expect(result).toEqual({
        access_token: 'login-token',
        user: {
          id: 'existing-user-id',
          name: 'Existing User',
          email: 'john@example.com',
          nickname: 'johnny',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
          password: undefined,
        },
      })
    })

    it('should throw HttpException if find returns error', async () => {
      userStorage.find = vi.fn().mockResolvedValueOnce({
        error: true,
      })

      await expect(
        controller.match({
          email: 'john@example.com',
          password: 'wrong',
          nickname: undefined,
        }),
      ).rejects.toThrow(HttpException)
    })
  })
})
