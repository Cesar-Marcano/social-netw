import { GraphQLFormattedError } from 'graphql';
import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Set up environment variables (global config)
    ConfigModule.forRoot({ isGlobal: true }),

    // Set up Mongoose with async configuration
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

    // Set up GraphQL with Apollo Driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Generate schema in 'src/schema.gql'
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Remove stack trace from GraphQL errors
      formatError: (formattedError, _error): GraphQLFormattedError => {
        const { message, extensions } = formattedError;

        // If the error was an internal server error, retrieves a generic response to the client.
        if (extensions!['code'] === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'Internal server error',
            extensions: {
              code: extensions!['code'],
            },
          };
        }

        return {
          message,
          extensions: {
            code: extensions!['code'],
            originalError: extensions!['originalError'],
          },
        };
      },
    }),

    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
