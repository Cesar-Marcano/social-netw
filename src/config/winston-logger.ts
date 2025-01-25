import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import * as packageJson from '../../package.json';

export const createLogger = () => {
  return WinstonModule.createLogger({
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
  });
};
