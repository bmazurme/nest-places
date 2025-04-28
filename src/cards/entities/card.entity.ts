import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsUrl, Length } from 'class-validator';
// import { Expose } from 'class-transformer';

import { BaseEntity } from '../../base-entity';

import { User } from '../../users/entities/user.entity';
import { Like } from '../../likes/entities/like.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { CardTag } from 'src/card-tags/entities/card-tag.entity';

// import { GROUP_USER } from '../../base-entity';

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
  @JoinTable()
  likes: Like[];

  @ManyToMany(() => Tag, (tag) => tag.cards)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => CardTag, (cardTag) => cardTag.card)
  @JoinTable()
  cardTags: CardTag[];
}
