import { IsOptional, IsString, Length } from 'class-validator';

/**
 * Data Transfer Object for creating a new role.
 * This class represents the structure of data required to create a new role entity.
 * All fields are optional but must meet specific validation criteria if provided.
 */
export class CreateRoleDto {
  /**
   * Role name
   * @type {string}
   * @description Name of the role
   * @validation Must be a string
   * @validation Length between 2 and 200 characters
   * @example 'admin'
   * @isRequired Optional
   */
  @IsString()
  @IsOptional()
  // @ValidateIf((dto) => dto.name !== '')
  @Length(2, 200)
  name: string;
}
