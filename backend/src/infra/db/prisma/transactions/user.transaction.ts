import { Injectable } from '@nestjs/common'
import { PrismaServicePostgres } from '../prisma.service'
import type { SignupBody } from '@/infra/http/session/user.dto'
import type { User } from 'prisma/generated/postgres'
import { S3Storage } from '../../image/s3.service'
import { hash } from 'bcryptjs'

@Injectable()
export class UserStorage {
  constructor(
    private prisma: PrismaServicePostgres,
    private s3: S3Storage,
  ) {}

  async create(data: SignupBody): Promise<User> {
    return await this.prisma.user.create({ data })
  }

  async find(payload: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload }, { nickname: payload }],
      },
    })
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
