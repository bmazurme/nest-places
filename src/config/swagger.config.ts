import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('NTLSTL place')
  .setDescription('The place API description')
  .setVersion('1.0')
  .addTag('ntlstl')
  .build();
