import { EnvModule } from '@/core/env/env.module'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../db/database.module'
import { SessionController } from './session/session.controller'
import { ProductController } from './store/products/product.controller'
import { ProductService } from './store/products/product.service'
import { SettingsController } from './settings/settings.controller'
import { SellerController } from './store/seller/seller.controller'

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [
    SessionController,
    ProductController,
    SellerController,
    SettingsController,
  ],
  providers: [ProductService, SellerController]
})
export class HttpModule {}
