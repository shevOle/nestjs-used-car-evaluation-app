import { NestFactory } from '@nestjs/core';
import {  ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: process.env.COOKIE_KEYS.split(','),
  }))
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  await app.listen(3000);
}
bootstrap();
