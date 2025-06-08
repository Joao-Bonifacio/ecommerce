import { Test } from '@nestjs/testing'
import { PrismaServicePostgres } from './prisma.service'
import { INestApplication } from '@nestjs/common'

describe('User module (integration)', () => {
  let app: INestApplication
  let prisma: PrismaServicePostgres

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaServicePostgres],
    }).compile()

    prisma = module.get(PrismaServicePostgres)
    await prisma.$connect()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  it('should fetch users (example)', async () => {
    const users = await prisma.user.findMany()
    expect(Array.isArray(users)).toBe(true)
  })
})
