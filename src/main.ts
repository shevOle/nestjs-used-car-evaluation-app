import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: 'http://localhost:4200',
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('User car evaluation tool')
    .setDescription(
      'Get estimate price of your old car based on similar ones sold around recently',
    )
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Reports')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
