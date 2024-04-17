import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(2, 200)
  name: string;
}
