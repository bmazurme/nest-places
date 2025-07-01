import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';

import { User } from '../../users/entities/user.entity';

/**
 * Data Transfer Object for creating a new card.
 * This class represents the structure of data required to create a new card entity.
 * It includes fields for card name, link, and user association.
 */
export class CreateCardDto {
  /**
   * Card name
   * @type {string}
   * @description Optional name of the card, must be between 2 and 200 characters
   * @example 'Important task'
   * @isOptional
   * @validation Valid if not empty and length between 2-200 characters
   */
  @IsString()
  @IsOptional()
  @ValidateIf((dto) => dto.name !== '')
  @Length(2, 200)
  name: string;

  /**
   * Card link
   * @type {string}
   * @description Optional URL associated with the card
   * @example 'https://example.com'
   * @isOptional
   * @validation Must be a valid URL
   */
  @IsUrl()
  @IsOptional()
  link: string;

  /**
   * User associated with the card
   * @type {User}
   * @description User entity representing the owner of the card
   * @isRequired
   * @example User { id: 1, username: 'john_doe' }
   */
  user: User;
}
