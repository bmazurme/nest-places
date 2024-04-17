import { Module } from '@nestjs/common';
import { CardLikesService } from './card-likes.service';
import { CardLikesController } from './card-likes.controller';

@Module({
  controllers: [CardLikesController],
  providers: [CardLikesService],
})
export class CardLikesModule {}
