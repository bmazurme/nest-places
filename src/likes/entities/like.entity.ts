import { Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Like extends BaseEntity {
  @ManyToOne(() => Card, (card) => card.like)
  card: Card;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;
}
