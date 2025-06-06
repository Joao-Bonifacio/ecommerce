import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from '@/core/env/env'
import { APP_FILTER, RouterModule } from '@nestjs/core'
import { HttpModule } from './http/http.module'
import { AuthModule } from './auth/auth.module'
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'
import { LoggerMiddleware } from '@/core/log/logger.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: '/v1',
        module: HttpModule,
      },
    ]),
    SentryModule.forRoot(),
    AuthModule,
    HttpModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('events')
  }
}
