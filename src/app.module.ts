import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';

import config from './constants/config';
import { tokenConfig } from './constants/TokenConfig';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config, tokenConfig] }),
    AuthenticationModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
