/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common'
import { PrismaServicePostgres } from '../prisma.service'
import type { LoginBody, SignupBody } from '@/infra/http/session/user.dto'
import type { User } from 'prisma/generated/postgres'
import { S3Storage } from '../../image/s3.service'
import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

export type UserError =
  | { error: true; badEmail: true }
  | { error: true; badNickname: true }
  | { error: true; badUser: true }

export type UserFetched = {
  user: User
  access_token: string
}

@Injectable()
export class UserStorage {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaServicePostgres,
    private s3: S3Storage,
  ) {}

  async create(data: SignupBody): Promise<UserFetched | UserError> {
    const { name, email, nickname, password } = data
    const hashedPassword = await hash(password, 8)

    const userTransaction = await this.prisma.$transaction(async (db) => {
      const emailAlreadyExists = await db.user.findUnique({
        where: { email },
      })
      if (emailAlreadyExists) return { error: true, badEmail: true }
      const nicknameAlreadyExists = await db.user.findUnique({
        where: { nickname },
      })
      if (nicknameAlreadyExists) return { error: true, badNickname: true }

      const user = await db.user.create({
        data: { name, email, nickname, password: hashedPassword },
      })
      if (!user) return { error: true, badUser: true }

      return user
    })
    if (
      typeof userTransaction === 'object' &&
      'error' in userTransaction &&
      userTransaction.error
    ) {
      return userTransaction as UserError
    }

    const user = userTransaction as User
    const access_token = await this.jwt.signAsync({ sub: user.id, nickname: user.nickname })

    return { access_token, user }
  }

  async find(data: LoginBody): Promise<UserFetched | UserError> {
    const { email, nickname, password } = data
    const user = email
      ? await this.prisma.user.findUnique({ where: { email } })
      : await this.prisma.user.findUnique({ where: { nickname } })

    if (!user) return { error: true, badUser: true }
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) return { error: true, badUser: true }

    const access_token = await this.jwt.signAsync({ sub: user.id, nickname: user.nickname })
    return { access_token, user }
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    })
  }

  async updateAvatar(
    id: string,
    fileName: string,
    fileType: string,
    body: Buffer,
  ): Promise<void> {
    const { url } = await this.s3.upload({ fileName, fileType, body })
    await this.prisma.user.update({
      where: { id },
      data: { avatar: url },
    })
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const hashedPassword = await hash(password, 8)
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
