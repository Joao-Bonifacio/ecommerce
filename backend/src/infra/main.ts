import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from '../env/env.service'
import helmet from 'helmet'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import './instrument'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    forceCloseConnections: true,
  })
  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  app.enableShutdownHooks()
  app.enableCors({
    origin: envService.get('APP_ENDPOINT'),
    credentials: true,
  })
  app.use(
    session({
      secret: envService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.use(helmet())
  app.use(cookieParser())
  app.use(compression())

  await app.listen(port | 8080)
}
bootstrap()
