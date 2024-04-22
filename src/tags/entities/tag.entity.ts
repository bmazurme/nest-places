import { Column, Entity, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { CardTag } from '../../card-tags/entities/card-tag.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  @Length(2, 30)
  name: string;

  @OneToMany(() => CardTag, (cardTag) => cardTag.id)
  cardTag: CardTag[];
}
