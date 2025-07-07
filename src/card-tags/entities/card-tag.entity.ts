import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';
import { Tag } from '../../tags/entities/tag.entity';

/**
 * Entity class representing the many-to-many relationship between cards and tags.
 * This class serves as a join table to map the relationship between cards and tags in the database.
 * It extends BaseEntity to leverage TypeORM's functionality for database operations.
 */
@Entity()
export class CardTag extends BaseEntity {
  /**
   * Card identifier
   * @type {number}
   * @description Unique identifier of the card associated with this relationship
   * @example 123
   * @pattern ^\d+$
   * @isRequired
   */
  @Column()
  public cardId: number;

  /**
   * Tag identifier
   * @type {number}
   * @description Unique identifier of the tag associated with this relationship
   * @example 456
   * @pattern ^\d+$
   * @isRequired
   */
  @Column()
  public tagId: number;

  /**
   * Reference to the associated card
   * @type {Card}
   * @description Many-to-One relationship with the Card entity
   * @example Card { id: 123, title: 'Sample Card' }
   * @isRequired
   */
  @ManyToOne(() => Card, (card) => card.cardTags)
  public card: Card;

  /**
   * Reference to the associated tag
   * @type {Tag}
   * @description Many-to-One relationship with the Tag entity
   * @example Tag { id: 456, name: 'Important' }
   * @isRequired
   */
  @ManyToOne(() => Tag, (tag) => tag.cardTags)
  public tag: Tag;
}
