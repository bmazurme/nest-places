import { Entity, Column } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';

import { BaseEntity } from '../../base-entity';

@Entity()
export class User extends BaseEntity {
  // @Column()
  // @Length(2, 30)
  // username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;
}
