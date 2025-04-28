import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { Card } from '../../cards/entities/card.entity';
import { CardTag } from '../../card-tags/entities/card-tag.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  @Length(2, 30)
  name: string;

  @ManyToMany(() => Card, (card) => card.tags)
  cards: Card[];

  @OneToMany(() => CardTag, (cardTag) => cardTag.tag)
  @JoinTable()
  cardTags: CardTag[];
}
