import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { loggerConfig, swaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);
  app.enableCors();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(4000);
}
bootstrap();
