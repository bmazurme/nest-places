import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OAuthService } from './oauth.service';
// import { HashModule } from 'src/hash/hash.module';
import { OAuthController } from './oauth.controller';

import { UsersModule } from '../users/users.module';

import { YandexStrategy } from './strategies/yandex.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    // HashModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') ?? 'SECRET',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService, YandexStrategy, JwtStrategy],
  exports: [OAuthService],
})
export class OAuthModule {}
