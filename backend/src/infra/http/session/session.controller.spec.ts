import { SessionController } from './session.controller'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import { HttpException, HttpStatus } from '@nestjs/common'
import {
  createMockUserStorage,
  MockedService,
} from '@/test/mocks/services.mock'
import { Level, Role } from '@/prisma/generated/postgres'

describe('SessionController', () => {
  let controller: SessionController
  let userStorage: MockedService<UserStorage>

  const mockUserPayload = {
    id: 'user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    nickname: 'johnny',
    password: 'hashed-password-string',
    level: Level.BRONZE,
    role: Role.CUSTUMER,
    avatar: null,
  }

  beforeEach(() => {
    userStorage = createMockUserStorage()
    controller = new SessionController(userStorage as unknown as UserStorage)
  })

  describe('sign-up (create)', () => {
    const signUpBody = {
      name: 'John Doe',
      email: 'john@example.com',
      nickname: 'johnny',
      password: 'a-secure-password',
    }

    it('should create a user and return an access token without the password', async () => {
      // Arrange
      userStorage.create.mockResolvedValue({
        access_token: 'new-access-token',
        user: mockUserPayload,
      })

      const result = await controller.create(signUpBody)

      expect(userStorage.create).toHaveBeenCalledWith(signUpBody)
      expect(result.access_token).toBe('new-access-token')
      expect(result.user).toBeDefined()
      expect(result.user.password).toBeUndefined() // Crucial check for sensitive data
      expect(result.user.email).toBe(mockUserPayload.email)
    })

    it('should throw HttpException when user creation fails (e.g., email exists)', async () => {
      const errorResponse = { error: true as const, badUser: true as const }
      userStorage.create.mockResolvedValue(errorResponse)

      await expect(controller.create(signUpBody)).rejects.toThrow(
        new HttpException(errorResponse, HttpStatus.BAD_REQUEST),
      )
    })
  })

  describe('sign-in (match)', () => {
    const signInBody = {
      email: 'john@example.com',
      password: 'a-secure-password',
      nickname: undefined,
    }

    it('should log in a user and return an access token without the password', async () => {
      userStorage.find.mockResolvedValue({
        access_token: 'login-access-token',
        user: mockUserPayload,
      })

      const result = await controller.match(signInBody)

      expect(userStorage.find).toHaveBeenCalledWith(signInBody)
      expect(result.access_token).toBe('login-access-token')
      expect(result.user).toBeDefined()
      expect(result.user.password).toBeUndefined() // Crucial check for sensitive data
      expect(result.user.id).toBe(mockUserPayload.id)
    })

    it('should throw HttpException for invalid credentials', async () => {
      const errorResponse = { error: true as const, badUser: true as const }
      userStorage.find.mockResolvedValue(errorResponse)

      await expect(controller.match(signInBody)).rejects.toThrow(
        new HttpException(
          { message: 'Invalid Credentials' },
          HttpStatus.BAD_REQUEST,
        ),
      )
    })
  })

  describe('getCurrentUser', () => {
    it('should return the current user by ID', async () => {
      const userContext = { sub: 'user-id-123' }
      userStorage.findById.mockResolvedValue(mockUserPayload)

      const result = await controller.getCurrentUser(userContext)

      expect(userStorage.findById).toHaveBeenCalledWith(userContext.sub)
      expect(result).toEqual(mockUserPayload)
    })
  })

  describe('removeUser', () => {
    it('should call the delete method with the correct user ID', async () => {
      const userContext = { sub: 'user-id-123' }
      userStorage.delete.mockResolvedValue(undefined)

      await controller.removeUser(userContext)

      expect(userStorage.delete).toHaveBeenCalledWith(userContext.sub)
      expect(userStorage.delete).toHaveBeenCalledTimes(1)
    })
  })
})
