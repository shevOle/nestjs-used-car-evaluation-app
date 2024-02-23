import { NestFactory } from '@nestjs/core';
import {  ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { AppModule } from './app.module';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  await app.listen(3000);
}
bootstrap();
