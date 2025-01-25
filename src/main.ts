import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { globalPipes } from './config/global-pipes';
import { helmetConfig } from './config/helmet-config';
import { createLogger } from './config/winston-logger';

async function bootstrap() {
  // Creates the NestJS app
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(), // Uses Winston for logging.
  });

  const configService = app.get(ConfigService);

  // Get CORS origins from environment variables (default: '*')
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

  // Get the PORT from environment variables (default: 3000)
  const port = configService.get('PORT', 3000);

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,POST', // Allow only GET and POST methods (GraphQL requires these)
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.use(helmetConfig()); // Apply Helmet middleware globally for enhanced security

  app.useGlobalPipes(globalPipes); // Enable global validation pipe for DTO validation using class-validator

  await app.listen(port); // Start the server on the specified port
}

bootstrap();
