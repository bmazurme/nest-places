import { IsString } from 'class-validator';

/**
 * Data Transfer Object for searching users.
 * This class represents the structure of data required to perform a user search query.
 * Contains a single string field that holds the search query.
 */
export class FindUserDto {
  /**
   * Search query string
   * @type {string}
   * @description String used to search for users
   * @example 'john' or 'john.doe@example.com'
   * @isRequired
   * @validation Must be a valid string
   * @usage Can search by username, email, or any other user attribute
   */
  @IsString()
  query: string;
}
