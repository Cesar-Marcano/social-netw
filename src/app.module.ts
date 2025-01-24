import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { GraphQLFormattedError } from 'graphql';
import { CommentModule } from './comment/comment.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (formattedError, _error): GraphQLFormattedError => {
        const { message, extensions } = formattedError;

        return {
          message,
          extensions: {
            code: extensions!['code'],
            originalError: extensions!['originalError'],
          },
        };
      },
      debug: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({ filename: 'logs/application.log' }),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleFactoryOptions> => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/test',
        ),
      }),
    }),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
