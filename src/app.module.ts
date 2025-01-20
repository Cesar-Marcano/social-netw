import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UserModule,
  ],
})
export class AppModule {}
