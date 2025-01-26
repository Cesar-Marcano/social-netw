import { MongoServerError } from 'mongodb';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// Exception filter for catching MongoDB duplicate key errors (error code 11000)
@Catch(MongoServerError)
export class MongoDuplicateKeyExceptionFilter implements ExceptionFilter {
  // Initialize logger to log any relevant messages
  private readonly logger = new Logger(MongoDuplicateKeyExceptionFilter.name);

  // Catch method that handles MongoDB duplicate key errors
  catch(exception: MongoServerError, _host: ArgumentsHost) {
    // Check if the error code is 11000 (duplicate key error)
    if (exception.code === 11000) {
      // Extract the key pattern (fields that are violating the unique constraint)
      const keyPattern = exception['keyPattern'];

      // If keyPattern exists, identify the specific field that is duplicated
      if (keyPattern) {
        const duplicatedField = Object.keys(keyPattern)[0];

        if (duplicatedField) {
          // Throw a BadRequestException with a message indicating the field that is duplicated
          throw new BadRequestException(
            `${duplicatedField} already registered.`, // Message for the user
          );
        }
      }

      // Fallback error message for unexpected duplicate key issues
      throw new BadRequestException('Duplicate field error.');
    } else {
      // If it's not a duplicate key error, log the error message and stack trace
      this.logger.error('MongoDB Error: ' + exception.message, exception.stack);

      // Throw a generic InternalServerErrorException for any other MongoDB errors
      throw new InternalServerErrorException(
        'An unexpected server error occurred.', // Generic error message for internal issues
      );
    }
  }
}
