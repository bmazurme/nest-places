import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OAuthModule } from './oauth/oauth.module';
import { UsersModule } from './users/users.module';

import { TagsModule } from './tags/tags.module';
import { CardsModule } from './cards/cards.module';
import { LikesModule } from './likes/likes.module';
import { CardTagsModule } from './card-tags/card-tags.module';
import { RolesModule } from './roles/roles.module';
import { UserRolesModule } from './user-roles/user-roles.module';

import { Tag } from './tags/entities/tag.entity';
import { Role } from './roles/entities/role.entity';
import { Like } from './likes/entities/like.entity';
import { Card } from './cards/entities/card.entity';
import { CardTag } from './card-tags/entities/card-tag.entity';
import { User } from './users/entities/user.entity';
import { UserRole } from './user-roles/entities/user-role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST') ?? 'localhost',
        port: +configService.get('POSTGRES_PORT') || 5432,
        username: configService.get('POSTGRES_USER') ?? 'postgres',
        password: configService.get('POSTGRES_PASSWORD') ?? 'newPassword',
        database: configService.get('POSTGRES_DB') ?? 'nestplaces',
        entities: [User, UserRole, Tag, Role, Like, Card, CardTag],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    OAuthModule,
    UsersModule,
    TagsModule,
    CardsModule,
    LikesModule,
    CardTagsModule,
    RolesModule,
    UserRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
