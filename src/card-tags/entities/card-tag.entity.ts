import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../base-entity';

import { Card } from '../../cards/entities/card.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class CardTag extends BaseEntity {
  @Column()
  public cardId: number;

  @Column()
  public tagId: number;

  @ManyToOne(() => Card, (card) => card.cardTags)
  public card: Card;

  @ManyToOne(() => Tag, (tag) => tag.cardTags)
  public tag: Tag;
}
