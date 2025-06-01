import { Module } from '@nestjs/common'
import { UserStorage } from './prisma/transactions/user.transaction'
import { ProductStorage } from './prisma/transactions/product.transaction'
import { S3Storage } from './image/s3.service'
import { EnvModule } from '@/env/env.module'
import {
  PrismaServiceMongo,
  PrismaServicePostgres,
} from './prisma/prisma.service'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaServicePostgres,
    PrismaServiceMongo,
    UserStorage,
    ProductStorage,
    S3Storage,
  ],
  exports: [UserStorage, ProductStorage, S3Storage],
})
export class DatabaseModule {}
