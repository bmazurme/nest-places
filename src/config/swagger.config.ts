import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Configuration for Swagger documentation.
 * This configuration sets up the basic structure and metadata for the Swagger UI.
 * Includes title, description, version, and tags for organizing API endpoints.
 */
export const swaggerConfig = new DocumentBuilder()
  .setTitle('NTLSTL place')
  .setDescription('The place API description')
  .setVersion('1.0')
  .addTag('ntlstl')
  .build();
