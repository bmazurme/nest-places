import { Module } from '@nestjs/common';
import { CardTagsService } from './card-tags.service';
import { CardTagsController } from './card-tags.controller';

@Module({
  controllers: [CardTagsController],
  providers: [CardTagsService],
})
export class CardTagsModule {}
