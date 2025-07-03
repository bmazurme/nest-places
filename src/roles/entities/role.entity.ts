import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';
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

  @ManyToMany(() => User, (user) => user.userRoles)
  users: User[];

  /**
   * Link userRoles
   */
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  @JoinTable()
  userRoles: UserRole[];
}
