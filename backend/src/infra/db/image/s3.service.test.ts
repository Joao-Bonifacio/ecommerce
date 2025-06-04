import { S3Storage } from './s3.service'
import { EnvService } from '@/env/env.service'
import { describe, it, expect, beforeAll } from 'vitest'

describe('S3Storage Integration', () => {
  let s3: S3Storage

  beforeAll(() => {
    const configService = {
      get: (key: string) => {
        const mockEnv = {
          S3_BUCKET_NAME: 'ecommerce',
          S3_ACCESS_KEY: 'minioadmin',
          S3_SECRET_KEY: 'minioadmin123',
          S3_ENDPOINT: 'http://localhost:9000',
        }
        return mockEnv[key as keyof typeof mockEnv]
      },
    }

    const env = new EnvService(configService as any)
    s3 = new S3Storage(env)
  })

  it('should upload and delete a file in S3', async () => {
    const fileBuffer = Buffer.from('hello world')
    const fileName = 'test.jpeg'
    const fileType = 'image/jpeg'

    const { url } = await s3.upload({ fileName, fileType, body: fileBuffer })
    expect(url).toContain(fileName)

    const key = url.split('/').pop()
    expect(key).toBeTruthy()

    await s3.delete(key!)
  })
})
