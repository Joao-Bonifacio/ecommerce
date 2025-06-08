import { SettingsController } from './settings.controller'
import { UserStorage } from '@/infra/db/prisma/transactions/user.storage'
import type { Mocked } from 'vitest'

describe('SettingsController', () => {
  let controller: SettingsController
  let userStorageMock: ReturnType<typeof createUserStorageMock>

  const mockUser = { sub: 'user-id-123' }

  beforeEach(() => {
    userStorageMock = createUserStorageMock()
    controller = new SettingsController(userStorageMock)
  })

  it('should call updatePassword with correct arguments', async () => {
    const password = 'newSecurePassword123'
    await controller.updatePassword(mockUser, { password })

    expect(userStorageMock.updatePassword).toHaveBeenCalledWith(
      mockUser.sub,
      password,
    )
    expect(userStorageMock.updatePassword).toHaveBeenCalledTimes(1)
  })

  it('should call updateAvatar with correct arguments', async () => {
    const mockFile = {
      filename: 'avatar.png',
      mimetype: 'image/png',
      buffer: Buffer.from('image-content'),
    } as Express.Multer.File

    await controller.updateAvatar(mockUser, mockFile)

    expect(userStorageMock.updateAvatar).toHaveBeenCalledWith(
      mockUser.sub,
      mockFile.filename,
      mockFile.mimetype,
      mockFile.buffer,
    )
    expect(userStorageMock.updateAvatar).toHaveBeenCalledTimes(1)
  })
})

function createUserStorageMock() {
  return {
    updatePassword: vi.fn().mockResolvedValue(undefined),
    updateAvatar: vi.fn().mockResolvedValue(undefined),
  } as unknown as Mocked<UserStorage>
}
