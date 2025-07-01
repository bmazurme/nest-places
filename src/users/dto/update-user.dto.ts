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

/**
 * Data Transfer Object for updating user information.
 * This class extends PartialType of CreateUserDto, making all its properties optional.
 * Adds additional fields for updating user's name, about section, and avatar.
 * Allows partial updates where only provided fields will be modified.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * User's name
   * @type {string}
   * @description User's display name
   * @example 'John Doe'
   * @validation Must be a string between 2 and 30 characters
   * @isRequired
   * @swagger
   * type: string
   * minLength: 2
   * maxLength: 30
   * example: 'John Doe'
   */
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  name: string;

  /**
   * User's about section
   * @type {string}
   * @description Optional description about the user
   * @example 'Software developer with 5 years of experience'
   * @isOptional
   * @validation Valid if not empty and length between 2-200 characters
   * @swagger
   * type: string
   * minLength: 2
   * maxLength: 200
   * example: 'Software developer with 5 years of experience'
   */
  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.about !== '')
  @Length(2, 200)
  about: string;

  /**
   * User's avatar URL
   * @type {string}
   * @description URL of the user's profile picture
   * @example 'https://example.com/avatar.jpg'
   * @isOptional
   * @validation Must be a valid URL
   * @swagger
   * type: string
   * format: uri
   * example: 'https://example.com/avatar.jpg'
   */
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar: string;
}
