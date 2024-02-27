import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { Report } from './reports/report.entity';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';

const cookieSession = require('cookie-session');

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
    UtilsModule,
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
  constructor(private config: ConfigService) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: this.config.get('COOKIE_KEYS').split(','),
    }))
  }
}
