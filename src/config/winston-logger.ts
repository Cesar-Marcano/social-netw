import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

// Importing the application package JSON for using its name in the logs
import * as packageJson from '../../package.json';

// Function to create and configure the logger
export const createLogger = () => {
  return WinstonModule.createLogger({
    level: 'debug', // Log level determines which log messages will be recorded. 'debug' means detailed logs will be recorded.
    transports: [
      // Console transport for logging to the console
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(), // Adds a timestamp to each log entry
          winston.format.ms(), // Adds the duration in ms
          nestWinstonModuleUtilities.format.nestLike(packageJson.name, {
            // Formats the log entries in a specific style, using 'nestLike' format
            colors: true, // Enables color coding for the console logs
            prettyPrint: true, // Makes the log output human-readable
            processId: true, // Includes the process ID in the logs
            appName: true, // Includes the application name (from package.json)
          }),
        ),
      }),
      // File transport for logging to a file
      new winston.transports.File({
        filename: 'logs/application.log', // Logs are saved in the application.log file
      }),
    ],
  });
};
