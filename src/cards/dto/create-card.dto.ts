import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';

import { User } from '../../users/entities/user.entity';

export class CreateCardDto {
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.name !== '')
  @Length(2, 200)
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  user: User;
}
