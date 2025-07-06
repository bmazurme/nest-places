import { User } from 'src/users/entities/user.entity';

/**
 * Data Transfer Object for creating a new like.
 * This class represents the structure of data required to create a new like entity.
 * Contains references to the card being liked and the user performing the action.
 */
export class CreateLikeDto {
  /**
   * Card being liked
   * @type {{ id: number }}
   * @description Object containing the ID of the card that receives the like
   * @example { id: 123 }
   * @isRequired
   * @validation Must contain a valid card ID
   */
  card: { id: number };

  /**
   * User performing the like action
   * @type {User}
   * @description User entity representing the person who likes the card
   * @example User { id: 456, username: 'john_doe' }
   * @isRequired
   * @validation Must be a valid user entity
   */
  user: User;
}
