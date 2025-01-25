import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { globalPipes } from './config/global-pipes';
import { helmetConfig } from './config/helmet-config';
import { createLogger } from './config/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(),
  });

  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  const port = configService.get('PORT', 3000);

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.use(helmetConfig());

  app.useGlobalPipes(globalPipes);

  await app.listen(port);
}

bootstrap();
