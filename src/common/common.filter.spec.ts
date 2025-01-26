import { MongoServerError } from 'mongodb';
import { MongoDuplicateKeyExceptionFilter } from './mongo-duplicate-key.filter';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

describe('MongoDuplicateKeyExceptionFilter', () => {
  let filter: MongoDuplicateKeyExceptionFilter;
  let loggerErrorMock: jest.SpyInstance;

  beforeEach(() => {
    filter = new MongoDuplicateKeyExceptionFilter();

    loggerErrorMock = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(new MongoDuplicateKeyExceptionFilter()).toBeDefined();
  });

  it('should handle MongoDB duplicate key error and throw BadRequestException', () => {
    const mockError = {
      code: 11000,
      keyPattern: { email: 1 },
      message: 'Duplicate key error',
    } as unknown as MongoServerError;

    const mockHost = {} as any;

    try {
      filter.catch(mockError, mockHost);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      expect((e as BadRequestException).message).toBe(
        'email already registered.',
      );
    }
  });

  it('should handle non-duplicate MongoDB errors and throw InternalServerErrorException', () => {
    const mockError = {
      code: 1234,
      message: 'Some other MongoDB error',
      stack: 'Error stack',
    } as unknown as MongoServerError;

    mockError.code = 12345;

    const mockHost = {} as any;

    try {
      filter.catch(mockError, mockHost);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);

      expect(loggerErrorMock).toHaveBeenCalledWith(
        'MongoDB Error: Some other MongoDB error',
        'Error stack',
      );
    }
  });
});
