import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';

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
  @JoinTable({
    name: 'cardTags',
    joinColumn: { name: 'tagId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cardId', referencedColumnName: 'id' },
  })
  cards: Card[];
}
