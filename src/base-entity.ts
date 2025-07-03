import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { Expose, Exclude } from 'class-transformer';
import { Exclude } from 'class-transformer';

export const GROUP_USER = 'group_user_details';

/**
 * Base entity class for all database entities.
 * Provides common fields and functionality shared by all entities.
 * Implements TypeORM entity pattern with primary key and timestamps.
 */
@Entity()
export class BaseEntity {
  /**
   * Unique identifier of the entity
   * @type {number}
   * @description Primary key generated automatically
   * @isRequired
   * @example 1, 2, 3
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Creation timestamp
   * @type {Date}
   * @description Automatically set when entity is created
   * @isRequired
   * @example '2025-07-01T10:00:00Z'
   * @Exclude() - not included in serialization by default
   */
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Last update timestamp
   * @type {Date}
   * @description Automatically updated on each modification
   * @isRequired
   * @example '2025-07-01T10:00:00Z'
   * @Exclude() - not included in serialization by default
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
