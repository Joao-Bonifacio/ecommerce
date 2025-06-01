import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserStorage } from '@/infra/db/prisma/transactions/user.transaction'
import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('settings')
export class SettingsController {
  constructor(private user: UserStorage) {}

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(
    @CurrentUser() user: { sub: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 * 10 }), // 20mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    const { filename: fileName, mimetype: fileType, buffer: body } = file
    return this.user.updateAvatar(user.sub, fileName, fileType, body)
  }

  @Patch()
  async updatePassword(
    @CurrentUser() user: { sub: string },
    @Body() body: { password: string },
  ): Promise<void> {
    return this.user.updatePassword(user.sub, body.password)
  }
}
