import { EnvModule } from '@/core/env/env.module'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../db/database.module'
import { SessionController } from './session/session.controller'
import { ProductController } from './store/products/product.controller'
import { ProductService } from './store/products/product.service'
import { SettingsController } from './settings/settings.controller'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [SessionController, ProductController, SettingsController],
  providers: [ProductService],
})
export class HttpModule {}
