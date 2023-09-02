import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    Session({
      name: 'siwe-quickstart',
      secret: 'siwe-quickstart-secret',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, sameSite: true },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
