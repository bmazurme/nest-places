import {
  IsEmail,
  // IsOptional,
  // IsString,
  // IsUrl,
  // Length,
  // ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  // @IsString()
  // @IsOptional()
  // @ValidateIf((dto) => dto.about !== '')
  // @Length(2, 200)
  // about: string;

  // @IsUrl()
  // @IsOptional()
  // avatar: string;

  @IsEmail()
  email: string;
}
