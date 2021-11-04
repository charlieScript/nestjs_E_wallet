import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
