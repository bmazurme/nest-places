import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { loggerConfig, swaggerConfig } from './common/configs';
import { configureCors } from './common/configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.use(cookieParser());
  configureCors(app);

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
