import { IsNumber, IsOptional } from 'class-validator';

export class CreateCardTagDto {
  @IsNumber()
  @IsOptional()
  cardId: number;

  @IsNumber()
  @IsOptional()
  tagId: number;
}
