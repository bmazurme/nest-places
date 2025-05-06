import { Entity, Column, OneToMany, JoinTable } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { Card } from '../../cards/entities/card.entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    default: 'Guest',
  })
  @Length(2, 30)
  name: string;

  @Column({
    default: '...',
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

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  @JoinTable()
  userRoles: UserRole[];

  @OneToMany(() => Like, (like) => like.user)
  likes: User;
}
