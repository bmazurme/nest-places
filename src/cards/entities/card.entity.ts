import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';

import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { CardTag } from '../../card-tags/entities/card-tag.entity';

@Entity()
export class Card extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  @OneToMany(() => Like, (like) => like.card)
  like: Like[];

  @OneToMany(() => CardTag, (cardTag) => cardTag.id)
  @JoinTable()
  cardTag: CardTag[];
}
