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
    }),
    ConfigModule.forRoot({ isGlobal: true }),
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
