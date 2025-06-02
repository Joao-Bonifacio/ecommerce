import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { Redis } from 'ioredis'
import crypto from 'node:crypto'
import { envSchema } from '@/env/env'
import {
  PrismaServicePostgres,
  PrismaServiceMongo,
} from '@/infra/db/prisma/prisma.service'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const schemaId = crypto.randomUUID()
const mongoDbName = `test_${schemaId}`

const postgres = new PrismaServicePostgres()
const mongo = new PrismaServiceMongo()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

function generateUniquePostgresURL(schemaId: string) {
  if (!env.POSTGRES_URL) {
    throw new Error('Please provide a POSTGRES_URL environment variable')
  }
  const url = new URL(env.POSTGRES_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

function generateUniqueMongoURL(dbName: string) {
  if (!env.MONGODB_URL) {
    throw new Error('Please provide a MONGODB_URL environment variable')
  }
  const url = new URL(env.MONGODB_URL)
  url.pathname = `/${dbName}`
  return url.toString()
}

beforeAll(async () => {
  const pgURL = generateUniquePostgresURL(schemaId)
  process.env.POSTGRES_URL = pgURL
  execSync('npx prisma generate --schema=prisma/postgres.schema.prisma')
  execSync('npx prisma migrate deploy --schema=prisma/postgres.schema.prisma')

  const mongoURL = generateUniqueMongoURL(mongoDbName)
  process.env.MONGO_URL = mongoURL
  execSync('npx prisma generate --schema=prisma/mongo.schema.prisma')
  execSync('npx prisma db push --schema=prisma/mongo.schema.prisma')
})

afterAll(async () => {
  await postgres.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  )
  await postgres.$disconnect()

  await mongo.$connect()

  const client = (mongo as any)._client || (mongo as any).client
  if (!client) {
    throw new Error('MongoDB client is not accessible from PrismaServiceMongo')
  }
  const db = client.db(mongoDbName)
  await db.dropDatabase()
  await mongo.$disconnect()

  await redis.quit()
})
