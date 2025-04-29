import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardsService } from './cards.service';

import { CardsController } from './cards.controller';
import { Card } from './entities/card.entity';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), LikesModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
