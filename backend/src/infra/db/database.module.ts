import { Module } from '@nestjs/common'
import { UserStorage } from './prisma/transactions/user.storage'
import { ProductStorage } from './prisma/transactions/product.storage'
import { S3Storage } from './image/s3.service'
import { EnvModule } from '@/core/env/env.module'
import {
  PrismaServiceMongo,
  PrismaServicePostgres,
} from './prisma/prisma.service'
import { CacheStorage } from './cache/cache.service'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaServicePostgres,
    PrismaServiceMongo,
    UserStorage,
    ProductStorage,
    S3Storage,
    CacheStorage,
  ],
  exports: [UserStorage, ProductStorage, S3Storage, CacheStorage],
})
export class DatabaseModule {}
