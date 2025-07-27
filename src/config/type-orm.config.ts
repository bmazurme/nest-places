import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Tag } from '../tags/entities/tag.entity';
import { Role } from '../roles/entities/role.entity';
import { Like } from '../likes/entities/like.entity';
import { Card } from '../cards/entities/card.entity';
import { User } from '../users/entities/user.entity';

export const TypeOrmModuleConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST') ?? 'localhost',
    port: +configService.get('POSTGRES_PORT') || 5432,
    username: configService.get('POSTGRES_USER') ?? 'postgres',
    password: configService.get('POSTGRES_PASSWORD') ?? 'newPassword',
    database: configService.get('POSTGRES_DB') ?? 'nestplaces',
    entities: [User, Tag, Role, Like, Card],
    synchronize: true,
  }),
  inject: [ConfigService],
});
