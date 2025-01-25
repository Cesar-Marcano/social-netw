import { MongoServerError } from 'mongodb';

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch(MongoServerError)
export class MongoDuplicateKeyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoDuplicateKeyExceptionFilter.name);

  catch(exception: MongoServerError, _host: ArgumentsHost) {
    if (exception.code === 11000) {
      const keyPattern = exception['keyPattern'];

      if (keyPattern) {
        const duplicatedField = Object.keys(keyPattern)[0];

        if (duplicatedField) {
          this.logger.warn(`Duplicate key error on field: ${duplicatedField}`);
          throw new BadRequestException(
            `${duplicatedField} already registered.`,
          );
        }
      }

      throw new BadRequestException('Duplicate field error.');
    } else {
      this.logger.error('MongoDB Error: ' + exception.message, exception.stack);
      throw new InternalServerErrorException(
        'An unexpected server error occurred.',
      );
    }
  }
}
