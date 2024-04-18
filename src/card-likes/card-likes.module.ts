import { Module } from '@nestjs/common';
import { CardLikesService } from './card-likes.service';
import { CardLikesController } from './card-likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardLike } from './entities/card-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardLike])],
  controllers: [CardLikesController],
  providers: [CardLikesService],
  exports: [CardLikesService],
})
export class CardLikesModule {}
