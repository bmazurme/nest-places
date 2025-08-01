import {
  Entity,
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
  EntityManager,
} from 'typeorm';
import { Length, IsUrl, IsEmail } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { Card } from '../../cards/entities/card.entity';
import { Like } from '../../likes/entities/like.entity';
import { Role } from '../../roles/entities/role.entity';

/**
 * User entity
 */
@Entity()
export class User extends BaseEntity {
  /**
   * User name
   */
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

  /**
   * User avatar
   */
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  /**
   * User email
   */
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'userRoles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Like, (like) => like.user)
  likes: User;

  async updateRoles(newRoles: Role[], manager: EntityManager): Promise<void> {
    try {
      this.roles = [];
      this.roles = newRoles;
      await manager.save(this);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Не удалось обновить роли пользователя');
    }
  }
}
