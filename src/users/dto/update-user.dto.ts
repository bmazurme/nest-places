import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.about !== '')
  @Length(2, 200)
  about: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar: string;
}
