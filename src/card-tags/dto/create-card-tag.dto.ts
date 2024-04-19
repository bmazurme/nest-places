import { IsNumber } from 'class-validator';

export class CreateCardTagDto {
  @IsNumber()
  cardId: number;

  @IsNumber()
  tagId: number;
}
