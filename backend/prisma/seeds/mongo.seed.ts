import { PrismaClient } from '../generated/mongo'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { EnvService } from '@/core/env/env.service'
import { ConfigService } from '@nestjs/config'
import { envSchema } from '@/core/env/env'
class S3Storage {
  private client: S3Client
  private env: EnvService

  constructor(env: EnvService) {
    this.env = env
    this.client = new S3Client({
      endpoint: this.env.get('S3_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: this.env.get('S3_ACCESS_KEY'),
        secretAccessKey: this.env.get('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: {
    fileName: string
    fileType: string
    body: Buffer
  }): Promise<{ url: string }> {
    const uploadId = crypto.randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('S3_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
        ACL: 'public-read-write',
      }),
    )

    return {
      url: `http://${this.env.get('S3_ENDPOINT')}/${this.env.get('S3_BUCKET_NAME')}/${uniqueFileName}`,
    }
  }
}

const prisma = new PrismaClient()
const env = new EnvService(new ConfigService(envSchema))
const s3 = new S3Storage(env)

export async function seed() {
  console.log('Cleaning products...')
  await prisma.product.deleteMany()

  const imagePath = path.join(__dirname, '../../test/image/sample.jpeg')
  const imageBuffer = fs.readFileSync(imagePath)

  const productsCount = 15

  for (let i = 0; i < productsCount; i++) {
    const { url } = await s3.upload({
      fileName: `sample-${i}.jpeg`,
      fileType: 'image/jpeg',
      body: imageBuffer,
    })

    const product = await prisma.product.create({
      data: {
        owner: faker.internet.username(),
        title: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
        price: parseFloat(faker.commerce.price()),
        sales: faker.number.int({ min: 0, max: 1000 }),
        image: url,
        description: faker.commerce.productDescription(),
        featured: faker.datatype.boolean(),
        stock: faker.number.int({ min: 1, max: 100 }),
        ratings: [],
      },
    })

    console.log(`Product created => ${product.title}`)
  }

  await prisma.$disconnect()
}
