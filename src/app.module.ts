import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';

// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OAuthModule } from './oauth/oauth.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { CardsModule } from './cards/cards.module';
import { LikesModule } from './likes/likes.module';
import { RolesModule } from './roles/roles.module';
import { FilesModule } from './files/files.module';
import { MinioModule } from './minio/minio.module';

import { TypeOrmModuleConfig } from './common/configs';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveStaticOptions: { index: false },
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    OAuthModule,
    AuthModule,
    UsersModule,
    TagsModule,
    CardsModule,
    LikesModule,
    RolesModule,
    FilesModule,
    MinioModule,
    PrometheusModule.register({
      path: '/metrics',
      // defaultMetrics: {
      //   enabled: false,
      // },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    makeCounterProvider({
      name: 'get_hello_calls',
      help: 'Total number of getHello calls',
    }),
  ],
})
export class AppModule {}
