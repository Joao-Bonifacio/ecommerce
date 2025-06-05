import { PrismaClient } from '../generated/postgres'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seed() {
  await prisma.user.deleteMany()

  const usersCount = 2

  for (let i = 0; i < usersCount; i++) {
    const password = await bcrypt.hash('@Paww0rd', 8)

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        nickname: faker.internet.username(),
        password,
        level: faker.helpers.arrayElement([
          'BRONZE',
          'SILVER',
          'GOLD',
          'PLATINUM',
        ]),
        role: faker.helpers.arrayElement(['CUSTUMER', 'SELLER', 'ADMIN']),
        avatar: faker.image.avatar(),
      },
    })
    console.log(`User created: ${user.nickname}`)
  }
}
