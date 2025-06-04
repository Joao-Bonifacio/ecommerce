import { EnvService } from '@/env/env.service'

export const mockEnv = {
  get(key: string) {
    const env = {
      S3_ENDPOINT: 'http://localhost:9000',
      S3_ACCESS_KEY: 'fake-access-key',
      S3_SECRET_KEY: 'fake-secret-key',
      S3_BUCKET_NAME: 'test-bucket',
    }
    return env[key]
  },
} as unknown as EnvService
