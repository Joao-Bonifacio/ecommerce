import { PrismaClient } from '../generated/mongo'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()

  const productsCount = 30

  for (let i = 0; i < productsCount; i++) {
    const product = await prisma.product.create({
      data: {
        owner: faker.internet.username(),
        title: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
        price: parseFloat(faker.commerce.price()),
        sales: faker.number.int({ min: 0, max: 1000 }),
        image: faker.image.url(),
        description: faker.commerce.productDescription(),
        featured: faker.datatype.boolean(),
        ratings: Array.from({
          length: faker.number.int({ min: 0, max: 5 }),
        }).map(() => ({
          title: faker.lorem.words(3),
          description: faker.lorem.sentences(2),
          stars: faker.number.int({ min: 1, max: 5 }),
        })),
      },
    })
    console.log(`Product created: ${product.id}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
