import { EnvModule } from '@/env/env.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [EnvModule],
})
export class HttpModule {}
