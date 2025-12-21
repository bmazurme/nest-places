import { Entity, Index, JoinTable, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Like entity
 */
@Entity()
@Unique(['card', 'user'])
export class Like extends BaseEntity {
  @ManyToOne(() => Card, (card) => card.likes, {
    onDelete: 'CASCADE',
  })
  @Index()
  card: Card;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinTable()
  user: User;
}
