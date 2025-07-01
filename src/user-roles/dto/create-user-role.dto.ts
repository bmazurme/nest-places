import { IsNumber } from 'class-validator';

/**
 * Data Transfer Object for assigning roles to users.
 * This class represents the structure of data required to create a user-role relationship.
 * Contains two mandatory numeric fields: userId and roleId.
 */
export class CreateUserRoleDto {
  /**
   * User identifier
   * @type {number}
   * @description Unique identifier of the user to assign the role
   * @example 123
   * @pattern ^\d+$
   * @isRequired
   * @validation Must be a valid user ID
   */
  @IsNumber()
  userId: number;

  /**
   * Role identifier
   * @type {number}
   * @description Unique identifier of the role to assign to the user
   * @example 1
   * @pattern ^\d+$
   * @isRequired
   * @validation Must be a valid role ID
   */
  @IsNumber()
  roleId: number;
}
