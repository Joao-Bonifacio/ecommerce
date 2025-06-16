import { SettingsController } from './settings.controller'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import {
  createMockUserStorage,
  MockedService,
} from '@/test/mocks/services.mock'

describe('SettingsController', () => {
  let controller: SettingsController
  let userStorage: MockedService<UserStorage>

  const mockUserContext = { sub: 'user-id-123' }

  beforeEach(() => {
    userStorage = createMockUserStorage()
    controller = new SettingsController(userStorage as unknown as UserStorage)
  })

  describe('updatePassword', () => {
    it('should call userStorage.updatePassword with the correct user ID and new password', async () => {
      const newPassword = 'new-super-secret-password'

      await controller.updatePassword(mockUserContext, {
        password: newPassword,
      })

      expect(userStorage.updatePassword).toHaveBeenCalledWith(
        mockUserContext.sub,
        newPassword,
      )
      expect(userStorage.updatePassword).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateAvatar', () => {
    it('should call userStorage.updateAvatar with correct user and file details', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        buffer: Buffer.from('fake-image-data'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        stream: require('stream').Readable.from(Buffer.from('fake-image-data')),
        destination: '',
        filename: 'generated-filename.png',
        path: '',
      }

      await controller.updateAvatar(mockUserContext, mockFile)

      expect(userStorage.updateAvatar).toHaveBeenCalledWith(
        mockUserContext.sub,
        mockFile.filename,
        mockFile.mimetype,
        mockFile.buffer,
      )
      expect(userStorage.updateAvatar).toHaveBeenCalledTimes(1)
    })
  })
})
