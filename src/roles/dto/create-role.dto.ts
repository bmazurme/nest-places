import { IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsOptional()
  // @ValidateIf((dto) => dto.name !== '')
  @Length(2, 200)
  name: string;
}
