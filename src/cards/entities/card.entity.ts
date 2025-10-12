import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsUrl, Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';

import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { Tag } from '../../tags/entities/tag.entity';

/**
 * Entity class representing a card in the system.
 * This class defines the structure and relationships of a card entity.
 * It extends BaseEntity to leverage TypeORM's functionality for database operations.
 */
@Entity()
export class Card extends BaseEntity {
  /**
   * Card name
   * @type {string}
   * @description Title or name of the card
   * @example 'Important task'
   * @validation Length between 1 and 250 characters
   * @isRequired
   */
  @Column()
  @Length(1, 250)
  name: string;

  /**
   * Card link
   * @type {string}
   * @description URL associated with the card
   * @example 'https://example.com'
   * @validation Must be a valid URL
   * @isRequired
   */
  @Column()
  @IsUrl()
  link: string;

  /**
   * Card owner
   * @type {User}
   * @description User who created the card
   * @example User { id: 1, username: 'john_doe' }
   * @isRequired
   * @relationship Many-to-One with User entity
   */
  @ManyToOne(() => User, (user) => user.cards, { eager: true })
  user: User;

  /**
   * Card likes
   * @type {Like[]}
   * @description Collection of likes associated with the card
   * @example [Like { id: 1, user: { id: 1 } }, Like { id: 2, user: { id: 2 } }]
   * @relationship One-to-Many with Like entity
   * @joinTable Uses a join table for the relationship
   */
  @OneToMany(() => Like, (like) => like.card, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  // @JoinTable()
  likes: Like[];

  /**
   * Card tags
   * @type {Tag[]}
   * @description Collection of tags associated with the card
   * @example [Tag { id: 1, name: 'important' }, Tag { id: 2, name: 'urgent' }]
   * @relationship Many-to-Many with Tag entity
   * @joinTable Uses a join table for the relationship
   */
  @ManyToMany(() => Tag, (tag) => tag.cards, {
    // nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'cardTags',
    joinColumn: { name: 'cardId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  get username(): string {
    return this.user.name;
  }
}
