import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleFactoryOptions> => ({
        uri:
          configService.get<string>('MONGO_URI') ??
          'http://localhost:27017/test',
      }),
      inject: [ConfigModule],
    }),
  ],
})
export class AppModule {}
