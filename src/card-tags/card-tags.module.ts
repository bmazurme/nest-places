import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardTagsService } from './card-tags.service';
import { CardTagsController } from './card-tags.controller';

import { CardTag } from './entities/card-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardTag])],
  controllers: [CardTagsController],
  providers: [CardTagsService],
  exports: [CardTagsService],
})
export class CardTagsModule {}
