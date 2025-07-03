import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { Card } from '../../cards/entities/card.entity';
import { CardTag } from '../../card-tags/entities/card-tag.entity';

/**
 * Entity class representing a tag in the system.
 * This class defines the structure and relationships of a tag entity.
 * It extends BaseEntity to leverage TypeORM's functionality for database operations.
 */
@Entity()
export class Tag extends BaseEntity {
  /**
   * Tag name
   * @type {string}
   * @description Name of the tag
   * @example 'important', 'urgent', 'work'
   * @validation Length between 2 and 30 characters
   * @isRequired
   */
  @Column()
  @Length(2, 30)
  name: string;

  /**
   * Cards associated with this tag
   * @type {Card[]}
   * @description Collection of cards that have this tag
   * @relationship Many-to-Many with Card entity
   * @example [Card { id: 1 }, Card { id: 2 }]
   */
  @ManyToMany(() => Card, (card) => card.tags)
  cards: Card[];

  /**
   * Card-tag relationships
   * @type {CardTag[]}
   * @description Collection of card-tag associations
   * @relationship One-to-Many with CardTag entity
   * @joinTable Uses a join table for the relationship
   * @example [CardTag { id: 1, cardId: 1, tagId: 1 }]
   */
  @OneToMany(() => CardTag, (cardTag) => cardTag.tag)
  @JoinTable()
  cardTags: CardTag[];
}
