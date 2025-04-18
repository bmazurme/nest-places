import { Entity, Column, OneToMany } from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { Card } from '../../cards/entities/card.entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';

// import { GROUP_USER } from '../../base-entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    default: 'Guest',
  })
  // @Expose({ groups: [GROUP_USER] })
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
  public userRole: UserRole[];
}
