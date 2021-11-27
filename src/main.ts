import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // for sessions
  // app.use(
  //   session({
  //     secret: '12345',
  //     resave: false,
  //     saveUninitialiased: false,
  //     cookie: { maxAge: 30000000 },
  //   }),
  // );
  // app.use(passport.initialize());
  // app.use(passport.session())
  // validation
  // app.use((_req, res): void => {
  //   res.status(404).send({
  //     success: false,
  //     error: 'resource not found',
  //   });
  // });
  app.useGlobalPipes(new ValidationPipe());
  dotenv.config();

  await app.listen(3000);
}
bootstrap();
