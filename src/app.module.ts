import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { Report } from './reports/report.entity';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';

const cookieSession = require('cookie-session');

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Report, User],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      })
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: process.env.COOKIE_KEYS.split(','),
    }))
  }
}
