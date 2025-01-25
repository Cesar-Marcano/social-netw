import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import * as packageJson from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(packageJson.name, {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        new winston.transports.File({ filename: 'logs/application.log' }),
      ],
    }),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  httpAdapter.getInstance().disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env['PORT'] ?? 3000);
}
bootstrap();
