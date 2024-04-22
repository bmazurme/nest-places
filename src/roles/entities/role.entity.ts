import { Column, Entity, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseEntity } from '../../base-entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';

@Entity()
export class Role extends BaseEntity {
  @Column()
  @Length(2, 30)
  name: string;

  @OneToMany(() => UserRole, (userRole) => userRole.id)
  public userRole: UserRole[];
}
