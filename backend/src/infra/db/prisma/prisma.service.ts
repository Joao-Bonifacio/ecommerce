import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient as Postgres } from '@/prisma/generated/postgres'
import { PrismaClient as Mongo } from '@/prisma/generated/mongo'

@Injectable()
export class PrismaServicePostgres
  extends Postgres
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super()
  }

  onModuleInit() {
    return this.$connect
  }

  onModuleDestroy() {
    return this.$disconnect
  }
}

@Injectable()
export class PrismaServiceMongo
  extends Mongo
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    return this.$connect
  }

  onModuleDestroy() {
    return this.$disconnect
  }
}
