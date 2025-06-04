import { EnvService } from '@/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

@Injectable()
export class CacheStorage extends Redis implements OnModuleDestroy {
  constructor(private env: EnvService) {
    super({
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
      db: env.get('REDIS_DB'),
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
