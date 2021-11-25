import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.url'),
      }),
      inject: [ConfigService], // required to provide the config values
    }),
    UserModule,
  ],
  providers: [UserService],
})
export class DatabaseModule {}
