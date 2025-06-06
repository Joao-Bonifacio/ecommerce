/* eslint-disable camelcase */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  type UserFetched,
  UserStorage,
} from '@/infra/db/prisma/transactions/user.storage'
import { Public } from '@/infra/auth/public'
import type { SignupBody, LoginBody } from './user.dto'
import { zSigninDTO, zSignupDTO } from './user.dto'
import { ZodValidatorPipe } from '@/infra/pipes/zod-validation.pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('session')
export class SessionController {
  constructor(private user: UserStorage) {}

  @Get('current')
  async getUser(@CurrentUser() user: { sub: string }) {
    return this.user.findById(user.sub)
  }

  @Public()
  @UsePipes(new ZodValidatorPipe(zSignupDTO))
  @Post('sign-up')
  async create(@Body() body: SignupBody) {
    const signup = await this.user.create(body)
    if (typeof signup === 'object' && 'error' in signup && signup.error) {
      throw new HttpException(signup, HttpStatus.BAD_REQUEST)
    }

    const { access_token, user } = signup as UserFetched
    return { access_token, user: { ...user, password: undefined } }
  }

  @Public()
  @UsePipes(new ZodValidatorPipe(zSigninDTO))
  @Post('sign-in')
  async match(@Body() body: LoginBody) {
    const signin = await this.user.find(body)
    if (typeof signin === 'object' && 'error' in signin && signin.error) {
      throw new HttpException(
        { message: 'Invalid Credentials' },
        HttpStatus.BAD_REQUEST,
      )
    }

    const { access_token, user } = signin as UserFetched
    return { access_token, user: { ...user, password: undefined } }
  }

  @Delete()
  @HttpCode(204)
  async removeUser(@CurrentUser() user: { sub: string }) {
    return this.user.delete(user.sub)
  }
}
