import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';

import { CreateCardTagDto } from './create-card-tag.dto';

export class UpdateCardTagDto extends PartialType(CreateCardTagDto) {
  @IsNumber()
  id: number;
}
