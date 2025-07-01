import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * Data Transfer Object for creating a new user.
 * This class represents the structure of data required to create a new user entity.
 * Currently includes only email as a mandatory field for user creation.
 */
export class CreateUserDto {
  /**
   * User email address
   * @type {string}
   * @description Unique email address of the user
   * @example 'user@example.com'
   * @isRequired
   * @validation Must be a valid email format
   * @swagger
   *   type: string
   *   format: email
   *   example: user@example.com
   */
  @ApiProperty()
  @IsEmail()
  email: string;
}
