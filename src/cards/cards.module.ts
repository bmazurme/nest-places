import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { LikesModule } from '../likes/likes.module';
import { TagsModule } from '../tags/tags.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    LikesModule,
    TagsModule,
    FilesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') ?? 'SECRET',
        signOptions: { expiresIn: '10d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CardsController],
  providers: [
    CardsService,
    makeCounterProvider({
      name: 'get_cards_calls',
      help: 'Total number of getCards calls',
    }),
  ],
  exports: [CardsService],
})
export class CardsModule {}
