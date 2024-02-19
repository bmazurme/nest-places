import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OAuthModule } from './oauth/oauth.module';
import { UsersModule } from './users/users.module';

import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') ?? 'localhost',
        port: +configService.get('DB_PORT') ?? 5432,
        username: configService.get('DB_USER') ?? 'student',
        password: configService.get('DB_PASSWORD') ?? '',
        database: configService.get('DB_NAME') ?? 'nestplaces',
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    OAuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
