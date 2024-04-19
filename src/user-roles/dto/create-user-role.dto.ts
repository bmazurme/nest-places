import { IsNumber } from 'class-validator';

export class CreateUserRoleDto {
  @IsNumber()
  cardId: number;

  @IsNumber()
  tagId: number;
}
