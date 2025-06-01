/* eslint-disable camelcase */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { UserStorage } from '@/infra/databases/prisma/transactions/user.transaction'
import { Public } from '@/infra/auth/public'
import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import type { SignupBody, LoginBody } from './user.dto'

@Controller('session')
export class SessionController {
  constructor(
    private jwt: JwtService,
    private user: UserStorage,
  ) {}

  @Public()
  @Post('sign-up')
  async create(@Body() body: SignupBody) {
    const { name, email, nickname, password } = body
    // make transactions | promise.all
    const nicknameAlreadyExists = await this.user.find(nickname)
    const emailAlreadyExists = await this.user.find(email)
    const hashedPassword = await hash(password, 8)

    if (emailAlreadyExists) {
      throw new HttpException(
        { message: 'Email already in use' },
        HttpStatus.BAD_REQUEST,
      )
    }
    if (nicknameAlreadyExists) {
      throw new HttpException(
        { message: 'Nickname already in use' },
        HttpStatus.BAD_REQUEST,
      )
    }
    const user = await this.user.create({
      name,
      email,
      nickname,
      password: hashedPassword,
    })

    const access_token = await this.jwt.signAsync({ sub: user.id })
    return { access_token }
  }

  @Public()
  @Post('sign-in')
  async match(@Body() body: LoginBody) {
    const { email, nickname, password } = body
    const user = email
      ? await this.user.find(email)
      : await this.user.find(nickname!)

    if (!user) {
      throw new HttpException(
        { message: 'Invalid Credentials' },
        HttpStatus.UNAUTHORIZED,
      )
    }
    const passwordMatch = compare(password, user.password)
    if (!passwordMatch) {
      throw new HttpException(
        { message: 'Invalid Credentials' },
        HttpStatus.UNAUTHORIZED,
      )
    }

    const access_token = await this.jwt.signAsync({ sub: user.id })
    return { access_token }
  }
}
