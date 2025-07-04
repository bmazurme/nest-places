import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

/**
 * Entity representing the many-to-many relationship between users and roles.
 * This class defines the structure of the user-role mapping table.
 * It extends BaseEntity to leverage TypeORM's functionality for database operations.
 */
@Entity()
export class UserRole extends BaseEntity {
  /**
   * User ID
   * @type {number}
   * @description Unique identifier of the user
   * @isRequired
   * @example 1
   * @validation Must be a positive integer
   */
  @Column()
  public userId: number;

  /**
   * Role ID
   * @type {number}
   * @description Unique identifier of the role
   * @isRequired
   * @example 1
   * @validation Must be a positive integer
   */
  @Column()
  public roleId: number;

  /**
   * User entity
   * @type {User}
   * @description Reference to the user entity
   * @relationship Many-to-One with User entity
   * @isRequired
   * @example User { id: 1, username: 'admin' }
   */
  @ManyToOne(() => User, (user) => user.userRoles)
  public user: User;

  /**
   * Role entity
   * @type {Role}
   * @description Reference to the role entity
   * @relationship Many-to-One with Role entity
   * @isRequired
   * @example Role { id: 1, name: 'admin' }
   */
  @ManyToOne(() => Role, (role) => role.userRoles)
  public role: Role;
}
