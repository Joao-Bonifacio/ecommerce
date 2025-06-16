import { beforeAll, afterAll } from 'vitest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/infra/app.module'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleRef.createNestApplication()
  await app.init()
})

afterAll(async () => {
  await app.close()
})
