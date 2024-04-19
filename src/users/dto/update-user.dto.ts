import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.about !== '')
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;
}
