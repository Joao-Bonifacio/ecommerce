import { SessionController } from './session.controller'
import { JwtService } from '@nestjs/jwt'
import { UserStorage } from '@/infra/db/prisma/transactions/user.transaction'
import { HttpException, HttpStatus } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { Level, Role } from '@/prisma/generated/postgres'

describe('SessionController', () => {
  let controller: SessionController
  let jwtService: JwtService
  let userStorage: UserStorage

  beforeEach(() => {
    jwtService = {
      signAsync: vi.fn(),
    } as any

    userStorage = {
      find: vi.fn(),
      create: vi.fn(),
    } as any

    controller = new SessionController(jwtService, userStorage)
  })

  describe('sign-up', () => {
    it('should sign-up and return jwt token', async () => {
      const body = {
        name: 'John',
        email: 'john@example.com',
        nickname: 'johnny',
        password: '123456',
      }

      vi.spyOn(userStorage, 'find')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)

      vi.spyOn(userStorage, 'create').mockResolvedValueOnce({
        id: 'user-id',
        name: 'John',
        email: 'john@example.com',
        nickname: 'johnny',
        password: 'hashed-password',
        level: Level.BRONZE,
        role: Role.CUSTUMER,
        avatar: null,
      })
      vi.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access-token')

      const result = await controller.create(body)

      expect(result).toEqual({
        access_token: 'access-token',
        user: {
          id: 'user-id',
          name: 'John',
          email: 'john@example.com',
          nickname: 'johnny',
          level: 'BRONZE',
          role: 'CUSTUMER',
          avatar: null,
        },
      })
    })

    it('should return an error if email already exists', async () => {
      vi.spyOn(userStorage, 'find')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existing-user-id',
          name: 'Existing User',
          email: 'used@example.com',
          nickname: 'existingnick',
          password: 'hashed-password',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
        })

      await expect(() =>
        controller.create({
          name: 'Test',
          email: 'used@example.com',
          nickname: 'newnick',
          password: '123',
        }),
      ).rejects.toThrowError(
        new HttpException(
          { message: 'Email already in use' },
          HttpStatus.BAD_REQUEST,
        ),
      )
    })

    it('should return an error if nickname already exists', async () => {
      vi.spyOn(userStorage, 'find')
        .mockResolvedValueOnce({
          id: 'existing-user-id',
          name: 'Existing User',
          email: 'existing@example.com',
          nickname: 'usednick',
          password: 'hashed-password',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
        })
        .mockResolvedValueOnce(null)

      await expect(() =>
        controller.create({
          name: 'Test',
          email: 'new@example.com',
          nickname: 'usednick',
          password: '@Passw0rd',
        }),
      ).rejects.toThrowError(
        new HttpException(
          { message: 'Nickname already in use' },
          HttpStatus.BAD_REQUEST,
        ),
      )
    })
  })

  describe('sign-in', () => {
    it('should sign-in with email and return jwt token and user', async () => {
      const password = '@Passw0rd'
      const hashed = await hash(password, 8)

      const existingUser = {
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'existing@example.com',
        nickname: 'usednick',
        password: hashed,
        level: Level.BRONZE,
        role: Role.CUSTUMER,
        avatar: null,
      }

      vi.spyOn(userStorage, 'find')
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null)

      vi.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('login-token')

      const result = await controller.match({
        email: 'john@example.com',
        password,
        nickname: undefined,
      })

      expect(result).toEqual({
        access_token: 'login-token',
        user: {
          id: 'existing-user-id',
          name: 'Existing User',
          email: 'existing@example.com',
          nickname: 'usednick',
          level: Level.BRONZE,
          role: Role.CUSTUMER,
          avatar: null,
        },
      })
    })

    it('should return error if password is wrong (no match)', async () => {
      vi.spyOn(userStorage, 'find').mockResolvedValueOnce({
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'existing@example.com',
        nickname: 'usednick',
        password: 'hashed-password',
        level: Level.BRONZE,
        role: Role.CUSTUMER,
        avatar: null,
      })

      await expect(() =>
        controller.match({
          email: 'john@example.com',
          password: 'wrong-password',
          nickname: undefined,
        }),
      ).rejects.toThrowError(
        new HttpException(
          { message: 'Invalid Credentials' },
          HttpStatus.UNAUTHORIZED,
        ),
      )
    })

    it('should return error if password is wrong (even with correct hash simulation)', async () => {
      const correctHash = await hash('correct', 8)

      vi.spyOn(userStorage, 'find').mockResolvedValueOnce({
        id: 'existing-user-id',
        name: 'Existing User',
        email: 'existing@example.com',
        nickname: 'usednick',
        password: correctHash,
        level: Level.BRONZE,
        role: Role.CUSTUMER,
        avatar: null,
      })

      await expect(() =>
        controller.match({
          email: 'john@example.com',
          password: 'wrong-password',
          nickname: undefined,
        }),
      ).rejects.toThrowError(
        new HttpException(
          { message: 'Invalid Credentials' },
          HttpStatus.UNAUTHORIZED,
        ),
      )
    })
  })
})
