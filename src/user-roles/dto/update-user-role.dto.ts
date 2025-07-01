import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';

import { CreateUserRoleDto } from './create-user-role.dto';

/**
 * Data Transfer Object for updating existing user-role relationships.
 * This class extends PartialType of CreateUserRoleDto, making all its properties optional.
 * Adds an additional mandatory 'id' field to identify the existing user-role relationship to update.
 */
export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  /**
   * Unique identifier of the user-role relationship to update
   * @type {number}
   * @description Primary key used to identify the specific user-role relationship record in the database
   * @example 456
   * @pattern ^\d+$
   * @isRequired
   * @validation Must be a valid existing user-role relationship ID
   */
  @IsNumber()
  id: number;
}
