import { IsString, Length } from 'class-validator';

/**
 * Data Transfer Object for creating new tags.
 * This class represents the structure of data required to create a new tag entity.
 * Contains a single mandatory field for the tag name.
 */
export class CreateTagDto {
  /**
   * Tag name
   * @type {string}
   * @description Name of the tag
   * @example 'important' or 'urgent'
   * @validation Must be a string between 2 and 200 characters
   * @isRequired
   * @swagger
   * type: string
   * minLength: 2
   * maxLength: 200
   * example: 'important'
   */
  @IsString()
  @Length(2, 200)
  name: string;
}
