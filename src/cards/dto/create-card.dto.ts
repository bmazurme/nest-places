import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.name !== '')
  @Length(2, 200)
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;
}
