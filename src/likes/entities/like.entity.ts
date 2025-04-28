import { Entity, JoinTable, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Like extends BaseEntity {
  @ManyToOne(() => Card, (card) => card.likes)
  card: Card;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinTable()
  user: User;
}
