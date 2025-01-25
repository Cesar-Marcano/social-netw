import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { globalPipes } from './config/global-pipes';
import { helmetConfig } from './config/helmet-config';
import { createLogger } from './config/winston-logger';
import { RemoveHeaderInterceptor } from './config/remove-headers.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(),
  });

  app.useGlobalInterceptors(new RemoveHeaderInterceptor());

  app.use(helmetConfig());

  app.useGlobalPipes(globalPipes);

  const configService = app.get(ConfigService);

  const logger = new Logger();

  const port = configService.get('PORT', 3000);
  if (port === 3000 && process.env['NODE_ENV']?.toLowerCase() == 'production') {
    logger.warn('Using port 3000 in production.');
  }

  await app.listen(configService.get('PORT', 3000));
}

bootstrap();
