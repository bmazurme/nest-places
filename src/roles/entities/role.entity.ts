import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { User } from '../../users/entities/user.entity';

/**
 * Role entity
 */
@Entity()
export class Role extends BaseEntity {
  /**
   * Role name
   */
  @Column()
  @Length(2, 30)
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'userRoles',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];
}
